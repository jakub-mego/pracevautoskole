"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, isNull, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { newId } from "@/lib/utils/id";
import { sendEmail } from "@/lib/email/client";
import { newMessageEmail } from "@/lib/email/templates";
import {
  conversations,
  messages,
  profiles,
  professionalProfiles,
  users,
  listings,
} from "../../../drizzle/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const BodySchema = z
  .string()
  .trim()
  .min(2, "Zpráva musí mít aspoň 2 znaky.")
  .max(4000, "Zpráva může mít maximálně 4000 znaků.");

export type FormActionState = { error?: string; ok?: boolean } | undefined;

async function ensureProfile() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");
  return { session, profile };
}

async function loadCounterpartContact(profileId: string) {
  const rows = await db
    .select({
      profile: profiles,
      userEmail: users.email,
      anonymous: professionalProfiles.anonymous,
    })
    .from(profiles)
    .leftJoin(users, eq(users.id, profiles.userId))
    .leftJoin(
      professionalProfiles,
      eq(professionalProfiles.profileId, profiles.id),
    )
    .where(eq(profiles.id, profileId))
    .limit(1);
  return rows[0] ?? null;
}

export async function startConversationAction(input: {
  recipientProfileId: string;
  listingId?: string;
  body: string;
}) {
  const { profile } = await ensureProfile();
  if (input.recipientProfileId === profile.id) {
    return { error: "Sám sobě napsat nemůžeš." };
  }
  const recipient = await loadCounterpartContact(input.recipientProfileId);
  if (!recipient) return { error: "Příjemce nenalezen." };

  const parsedBody = BodySchema.safeParse(input.body);
  if (!parsedBody.success) {
    return { error: parsedBody.error.issues[0]?.message ?? "Neplatná zpráva." };
  }

  let listingIdParam: string | null = null;
  if (input.listingId) {
    const listingRow = (
      await db
        .select({ id: listings.id })
        .from(listings)
        .where(eq(listings.id, input.listingId))
        .limit(1)
    )[0];
    if (listingRow) listingIdParam = listingRow.id;
  }

  // Hledej existující konverzaci v páru (initiator/recipient bidirekčně) +
  // listing. Pokud existuje, použij ji.
  const existing = await db
    .select()
    .from(conversations)
    .where(
      and(
        listingIdParam
          ? eq(conversations.listingId, listingIdParam)
          : isNull(conversations.listingId),
        // Páry: A->B nebo B->A
        // SQL: ((init=A AND recip=B) OR (init=B AND recip=A))
        // Vyjádříme přes or() níže — ale Drizzle umí použít sql template:
      ),
    );

  let conv =
    existing.find(
      (c) =>
        (c.initiatorProfileId === profile.id &&
          c.recipientProfileId === input.recipientProfileId) ||
        (c.initiatorProfileId === input.recipientProfileId &&
          c.recipientProfileId === profile.id),
    ) ?? null;

  const now = new Date();
  const isProfessionalInitiator = profile.type === "professional";

  if (!conv) {
    const newConvId = newId();
    const inserted = await db
      .insert(conversations)
      .values({
        id: newConvId,
        initiatorProfileId: profile.id,
        recipientProfileId: input.recipientProfileId,
        listingId: listingIdParam,
        // Profesionál sám napsal → odhalil se vůči konkrétnímu příjemci.
        anonymityLifted: isProfessionalInitiator,
        lastMessageAt: now,
      })
      .returning();
    conv = inserted[0]!;
  }

  await db.transaction(async (tx) => {
    await tx.insert(messages).values({
      id: newId(),
      conversationId: conv!.id,
      authorProfileId: profile.id,
      body: parsedBody.data,
    });
    await tx
      .update(conversations)
      .set({ lastMessageAt: now })
      .where(eq(conversations.id, conv!.id));
  });

  // Email notifikace příjemci (best-effort).
  if (recipient.userEmail) {
    const senderDisplayName =
      profile.type === "professional" && recipient.anonymous === false
        ? profile.displayName
        : profile.type === "professional"
          ? profile.displayName // sender se neskrývá; jen v listu konverzací u jiných uživatelů
          : profile.displayName;
    const tpl = newMessageEmail({
      recipientName: recipient.profile.displayName ?? null,
      senderName: senderDisplayName,
      body: parsedBody.data,
      conversationUrl: `${APP_URL}/zpravy/${conv.id}`,
    });
    void sendEmail({ to: recipient.userEmail, ...tpl }).catch((err) =>
      console.error("[messaging] email send failed", err),
    );
  }

  revalidatePath("/zpravy");
  revalidatePath(`/zpravy/${conv.id}`);
  return { ok: true, conversationId: conv.id };
}

export async function sendMessageAction(input: {
  conversationId: string;
  body: string;
}) {
  const { profile } = await ensureProfile();
  const parsedBody = BodySchema.safeParse(input.body);
  if (!parsedBody.success) {
    return { error: parsedBody.error.issues[0]?.message ?? "Neplatná zpráva." };
  }

  const conv = (
    await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, input.conversationId))
      .limit(1)
  )[0];
  if (!conv) return { error: "Konverzace nenalezena." };
  if (
    conv.initiatorProfileId !== profile.id &&
    conv.recipientProfileId !== profile.id
  ) {
    return { error: "Nemáš přístup k této konverzaci." };
  }

  const counterpartId =
    conv.initiatorProfileId === profile.id
      ? conv.recipientProfileId
      : conv.initiatorProfileId;
  const counterpart = await loadCounterpartContact(counterpartId);

  // Pokud profesionál odpovídá poprvé v konverzaci, kterou nezahájil →
  // odhalí se (anonymityLifted = true). Po lift už nikdy zpět.
  const isProfessional = profile.type === "professional";
  let liftAnonymity = false;
  if (
    isProfessional &&
    !conv.anonymityLifted &&
    conv.recipientProfileId === profile.id
  ) {
    liftAnonymity = true;
  }

  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.insert(messages).values({
      id: newId(),
      conversationId: conv.id,
      authorProfileId: profile.id,
      body: parsedBody.data,
    });
    await tx
      .update(conversations)
      .set({
        lastMessageAt: now,
        ...(liftAnonymity ? { anonymityLifted: true } : {}),
      })
      .where(eq(conversations.id, conv.id));
  });

  if (counterpart?.userEmail) {
    const tpl = newMessageEmail({
      recipientName: counterpart.profile.displayName ?? null,
      senderName: profile.displayName,
      body: parsedBody.data,
      conversationUrl: `${APP_URL}/zpravy/${conv.id}`,
    });
    void sendEmail({ to: counterpart.userEmail, ...tpl }).catch((err) =>
      console.error("[messaging] email send failed", err),
    );
  }

  revalidatePath("/zpravy");
  revalidatePath(`/zpravy/${conv.id}`);
  return { ok: true };
}

export async function markConversationReadAction(conversationId: string) {
  const { profile } = await ensureProfile();
  const conv = (
    await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1)
  )[0];
  if (!conv) return;
  if (
    conv.initiatorProfileId !== profile.id &&
    conv.recipientProfileId !== profile.id
  ) {
    return;
  }
  await db
    .update(messages)
    .set({ readByRecipientAt: new Date() })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        ne(messages.authorProfileId, profile.id),
        isNull(messages.readByRecipientAt),
      ),
    );
  revalidatePath("/zpravy");
  revalidatePath(`/zpravy/${conversationId}`);
}
