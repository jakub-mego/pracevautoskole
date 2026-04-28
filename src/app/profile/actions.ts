"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { newId } from "@/lib/utils/id";
import { putObject, deleteObject } from "@/lib/storage/client";
import { recomputeMatchesForCounterpartProfile } from "@/lib/matching/queries";
import {
  users,
  profiles,
  employerProfiles,
  professionalProfiles,
  professionalRoles,
  professionalLicenses,
} from "../../../drizzle/schema";

export type FormActionState = { error?: string; ok?: boolean } | undefined;

const optionalEmail = z
  .union([z.email(), z.literal("")])
  .optional()
  .transform((v) => (v ? v : null));
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));
const optionalUrl = z
  .union([z.url(), z.literal("")])
  .optional()
  .transform((v) => (v ? v : null));

const RoleSchema = z.enum([
  "instructor",
  "master_practice",
  "operator_admin",
  "lecturer_48",
  "manager",
  "medic",
]);
const LicenseSchema = z.enum([
  "AM", "A1", "A2", "A",
  "B1", "B", "BE",
  "C1", "C1E", "C", "CE",
  "D1", "D1E", "D", "DE",
  "T",
]);

const CommonSchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  about: optionalText(2000),
  region: optionalText(80),
  city: optionalText(80),
  postalCode: optionalText(10),
});

const EmployerSchema = CommonSchema.extend({
  publicEmail: optionalEmail,
  phone: optionalText(40),
  website: optionalUrl,
});

const ProfessionalSchema = CommonSchema.extend({
  publicEmail: optionalEmail,
  phone: optionalText(40),
  anonymous: z.coerce.boolean().optional(),
  activelySeeking: z.coerce.boolean().optional(),
  roles: z.array(RoleSchema).min(1, "Vyber alespoň jednu roli."),
  licenses: z.array(LicenseSchema).default([]),
});

export async function updateEmployerProfileAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");
  if (profile.type !== "employer") return { error: "Tento profil není autoškola." };

  const parsed = EmployerSchema.safeParse({
    displayName: formData.get("displayName"),
    about: formData.get("about") ?? "",
    region: formData.get("region") ?? "",
    city: formData.get("city") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    publicEmail: formData.get("publicEmail") ?? "",
    phone: formData.get("phone") ?? "",
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const d = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        displayName: d.displayName,
        about: d.about,
        region: d.region,
        city: d.city,
        postalCode: d.postalCode,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id));
    await tx
      .update(employerProfiles)
      .set({
        publicEmail: d.publicEmail,
        phone: d.phone,
        website: d.website,
        updatedAt: new Date(),
      })
      .where(eq(employerProfiles.profileId, profile.id));
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  void recomputeMatchesForCounterpartProfile("employer").catch((err) =>
    console.error("[matching] employer profile recompute failed", err),
  );
  return { ok: true };
}

export async function updateProfessionalProfileAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");
  if (profile.type !== "professional")
    return { error: "Tento profil není profesionál." };

  const parsed = ProfessionalSchema.safeParse({
    displayName: formData.get("displayName"),
    about: formData.get("about") ?? "",
    region: formData.get("region") ?? "",
    city: formData.get("city") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    publicEmail: formData.get("publicEmail") ?? "",
    phone: formData.get("phone") ?? "",
    anonymous: formData.get("anonymous") === "on",
    activelySeeking: formData.get("activelySeeking") === "on",
    roles: formData.getAll("roles"),
    licenses: formData.getAll("licenses"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const d = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        displayName: d.displayName,
        about: d.about,
        region: d.region,
        city: d.city,
        postalCode: d.postalCode,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id));
    await tx
      .update(professionalProfiles)
      .set({
        publicEmail: d.publicEmail,
        phone: d.phone,
        anonymous: d.anonymous ?? false,
        activelySeeking: d.activelySeeking ?? false,
        updatedAt: new Date(),
      })
      .where(eq(professionalProfiles.profileId, profile.id));
    await tx.delete(professionalRoles).where(eq(professionalRoles.profileId, profile.id));
    await tx
      .delete(professionalLicenses)
      .where(eq(professionalLicenses.profileId, profile.id));
    if (d.roles.length) {
      await tx.insert(professionalRoles).values(
        d.roles.map((role) => ({ id: newId(), profileId: profile.id, role })),
      );
    }
    if (d.licenses.length) {
      await tx.insert(professionalLicenses).values(
        d.licenses.map((category) => ({
          id: newId(),
          profileId: profile.id,
          category,
        })),
      );
    }
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  void recomputeMatchesForCounterpartProfile("professional").catch((err) =>
    console.error("[matching] professional profile recompute failed", err),
  );
  return { ok: true };
}

const ALLOWED_CREDENTIAL_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);
const MAX_CREDENTIAL_BYTES = 10 * 1024 * 1024;

function extensionFor(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

export async function uploadCredentialsAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");
  if (profile.type !== "professional") {
    return { error: "Ověření průkazu je pouze pro profesionální profil." };
  }

  const file = formData.get("credentials");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Vyber soubor s naskenovaným průkazem." };
  }
  if (file.size > MAX_CREDENTIAL_BYTES) {
    return { error: "Soubor je větší než 10 MB." };
  }
  if (!ALLOWED_CREDENTIAL_TYPES.has(file.type)) {
    return { error: "Povolené formáty: JPG, PNG, PDF." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extensionFor(file.type);
  const objectKey = `credentials/${profile.id}/${newId()}.${ext}`;

  const existingRows = await db
    .select({ key: professionalProfiles.credentialsObjectKey })
    .from(professionalProfiles)
    .where(eq(professionalProfiles.profileId, profile.id))
    .limit(1);
  const previousKey = existingRows[0]?.key ?? null;

  try {
    await putObject(objectKey, buffer, file.type);
  } catch (err) {
    console.error("[credentials] upload failed", err);
    return { error: "Nahrání selhalo, zkus to prosím znovu." };
  }

  await db
    .update(professionalProfiles)
    .set({
      credentialsObjectKey: objectKey,
      credentialsContentType: file.type,
      credentialsUploadedAt: new Date(),
      credentialsVerification: "pending",
      credentialsRejectionReason: null,
      credentialsReviewedAt: null,
      credentialsReviewerId: null,
      updatedAt: new Date(),
    })
    .where(eq(professionalProfiles.profileId, profile.id));

  if (previousKey && previousKey !== objectKey) {
    await deleteObject(previousKey);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  void recomputeMatchesForCounterpartProfile("professional").catch((err) =>
    console.error("[matching] professional profile recompute failed", err),
  );
  return { ok: true };
}

export async function deleteAccountAction(input: { confirm: string }) {
  const session = await requireSession();
  if (input.confirm !== "SMAZAT") {
    return { error: "Pro potvrzení napiš přesně SMAZAT." };
  }
  await db.delete(users).where(eq(users.id, session.user.id));
  // Cascade smaže sessions, accounts, profiles, listings, ...
  redirect("/?deleted=1");
}
