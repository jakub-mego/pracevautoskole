"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/server";
import { sendEmail } from "@/lib/email/client";
import {
  credentialsApprovedEmail,
  credentialsRejectedEmail,
} from "@/lib/email/templates";
import {
  listings,
  profiles,
  professionalProfiles,
  reports,
  users,
} from "../../../drizzle/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function adminArchiveListingAction(id: string) {
  await requireAdmin();
  await db
    .update(listings)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(listings.id, id));
  revalidatePath("/admin/listings");
  revalidatePath("/inzeraty");
  revalidatePath(`/inzeraty/${id}`);
}

export async function adminDeleteListingAction(id: string) {
  await requireAdmin();
  await db.delete(listings).where(eq(listings.id, id));
  revalidatePath("/admin/listings");
  revalidatePath("/inzeraty");
}

export async function adminDeleteUserAction(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    return { error: "Nemůžeš smazat sám sebe." };
  }
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function adminPromoteToAdminAction(userId: string) {
  await requireAdmin();
  await db
    .update(users)
    .set({ role: "admin", updatedAt: new Date() })
    .where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

export async function adminDemoteUserAction(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    return { error: "Nemůžeš demoteovat sám sebe." };
  }
  await db
    .update(users)
    .set({ role: "user", updatedAt: new Date() })
    .where(eq(users.id, userId));
  revalidatePath("/admin/users");
  return { ok: true };
}

async function loadCredentialContext(profileId: string) {
  const rows = await db
    .select({
      slug: profiles.slug,
      displayName: profiles.displayName,
      userId: profiles.userId,
      type: profiles.type,
      verification: professionalProfiles.credentialsVerification,
    })
    .from(profiles)
    .innerJoin(professionalProfiles, eq(professionalProfiles.profileId, profiles.id))
    .where(eq(profiles.id, profileId))
    .limit(1);
  return rows[0] ?? null;
}

async function loadUserEmail(userId: string) {
  const rows = await db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function adminApproveCredentialsAction(profileId: string) {
  const session = await requireAdmin();
  const ctx = await loadCredentialContext(profileId);
  if (!ctx || ctx.type !== "professional") {
    return { error: "Profil nenalezen nebo není profesionální." };
  }
  await db
    .update(professionalProfiles)
    .set({
      credentialsVerification: "verified",
      credentialsReviewedAt: new Date(),
      credentialsReviewerId: session.user.id,
      credentialsRejectionReason: null,
      updatedAt: new Date(),
    })
    .where(eq(professionalProfiles.profileId, profileId));

  const user = await loadUserEmail(ctx.userId);
  if (user) {
    const tpl = credentialsApprovedEmail({
      name: ctx.displayName ?? user.name ?? null,
      profileUrl: `${APP_URL}/p/${ctx.slug}`,
    });
    await sendEmail({ to: user.email, ...tpl });
  }

  revalidatePath("/admin/verifikace");
  revalidatePath(`/p/${ctx.slug}`);
  revalidatePath("/profile");
  return { ok: true };
}

export async function adminRejectCredentialsAction(input: {
  profileId: string;
  reason: string;
}) {
  const session = await requireAdmin();
  const reason = input.reason.trim();
  if (reason.length < 5) {
    return { error: "Důvod zamítnutí musí mít alespoň 5 znaků." };
  }
  const ctx = await loadCredentialContext(input.profileId);
  if (!ctx || ctx.type !== "professional") {
    return { error: "Profil nenalezen nebo není profesionální." };
  }
  await db
    .update(professionalProfiles)
    .set({
      credentialsVerification: "rejected",
      credentialsReviewedAt: new Date(),
      credentialsReviewerId: session.user.id,
      credentialsRejectionReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(professionalProfiles.profileId, input.profileId));

  const user = await loadUserEmail(ctx.userId);
  if (user) {
    const tpl = credentialsRejectedEmail({
      name: ctx.displayName ?? user.name ?? null,
      profileUrl: `${APP_URL}/profile`,
      reason,
    });
    await sendEmail({ to: user.email, ...tpl });
  }

  revalidatePath("/admin/verifikace");
  revalidatePath(`/p/${ctx.slug}`);
  revalidatePath("/profile");
  return { ok: true };
}

export async function adminResolveReportAction(input: {
  reportId: string;
  status: "resolved" | "dismissed";
  note?: string;
}) {
  const session = await requireAdmin();
  await db
    .update(reports)
    .set({
      status: input.status,
      resolverNote: input.note ?? null,
      resolvedByUserId: session.user.id,
      resolvedAt: new Date(),
    })
    .where(eq(reports.id, input.reportId));
  revalidatePath("/admin/reports");
  return { ok: true };
}
