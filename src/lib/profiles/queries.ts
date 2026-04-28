import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  profiles,
  employerProfiles,
  professionalProfiles,
  professionalRoles,
  professionalLicenses,
} from "../../../drizzle/schema";

export async function getProfileByUserId(userId: string) {
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getFullProfileByUserId(userId: string) {
  const profile = await getProfileByUserId(userId);
  if (!profile) return null;

  if (profile.type === "employer") {
    const rows = await db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.profileId, profile.id))
      .limit(1);
    return { profile, employer: rows[0] ?? null, professional: null, roles: [] as string[], licenses: [] as string[] };
  }

  const [proRows, rolesRows, licensesRows] = await Promise.all([
    db
      .select()
      .from(professionalProfiles)
      .where(eq(professionalProfiles.profileId, profile.id))
      .limit(1),
    db
      .select({ role: professionalRoles.role })
      .from(professionalRoles)
      .where(eq(professionalRoles.profileId, profile.id)),
    db
      .select({ category: professionalLicenses.category })
      .from(professionalLicenses)
      .where(eq(professionalLicenses.profileId, profile.id)),
  ]);
  return {
    profile,
    employer: null,
    professional: proRows[0] ?? null,
    roles: rolesRows.map((r) => r.role),
    licenses: licensesRows.map((l) => l.category),
  };
}

export async function getProfessionalVerificationByProfileId(profileId: string) {
  const rows = await db
    .select({
      verification: professionalProfiles.credentialsVerification,
      uploadedAt: professionalProfiles.credentialsUploadedAt,
      rejectionReason: professionalProfiles.credentialsRejectionReason,
      reviewedAt: professionalProfiles.credentialsReviewedAt,
    })
    .from(professionalProfiles)
    .where(eq(professionalProfiles.profileId, profileId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublicProfileBySlug(slug: string) {
  const profile = (
    await db.select().from(profiles).where(eq(profiles.slug, slug)).limit(1)
  )[0];
  if (!profile) return null;

  if (profile.type === "employer") {
    const employer = (
      await db
        .select()
        .from(employerProfiles)
        .where(eq(employerProfiles.profileId, profile.id))
        .limit(1)
    )[0];
    return {
      profile,
      employer: employer ?? null,
      professional: null,
      roles: [] as string[],
      licenses: [] as string[],
    };
  }

  const [proRows, rolesRows, licensesRows] = await Promise.all([
    db
      .select()
      .from(professionalProfiles)
      .where(eq(professionalProfiles.profileId, profile.id))
      .limit(1),
    db
      .select({ role: professionalRoles.role })
      .from(professionalRoles)
      .where(eq(professionalRoles.profileId, profile.id)),
    db
      .select({ category: professionalLicenses.category })
      .from(professionalLicenses)
      .where(eq(professionalLicenses.profileId, profile.id)),
  ]);
  const professional = proRows[0] ?? null;
  if (professional?.anonymous) return null;

  return {
    profile,
    employer: null,
    professional,
    roles: rolesRows.map((r) => r.role),
    licenses: licensesRows.map((l) => l.category),
  };
}

export async function getProfileContact(profileId: string) {
  const profile = (
    await db.select().from(profiles).where(eq(profiles.id, profileId)).limit(1)
  )[0];
  if (!profile) return null;

  if (profile.type === "employer") {
    const emp = (
      await db
        .select({
          publicEmail: employerProfiles.publicEmail,
          phone: employerProfiles.phone,
          website: employerProfiles.website,
          legalName: employerProfiles.legalName,
          ico: employerProfiles.ico,
        })
        .from(employerProfiles)
        .where(eq(employerProfiles.profileId, profileId))
        .limit(1)
    )[0];
    return {
      type: "employer" as const,
      anonymous: false,
      displayName: profile.displayName,
      publicEmail: emp?.publicEmail ?? null,
      phone: emp?.phone ?? null,
      website: emp?.website ?? null,
      legalName: emp?.legalName ?? null,
      ico: emp?.ico ?? null,
    };
  }

  const pro = (
    await db
      .select({
        anonymous: professionalProfiles.anonymous,
        publicEmail: professionalProfiles.publicEmail,
        phone: professionalProfiles.phone,
      })
      .from(professionalProfiles)
      .where(eq(professionalProfiles.profileId, profileId))
      .limit(1)
  )[0];
  return {
    type: "professional" as const,
    anonymous: pro?.anonymous ?? false,
    displayName: profile.displayName,
    publicEmail: pro?.publicEmail ?? null,
    phone: pro?.phone ?? null,
    website: null,
    legalName: null,
    ico: null,
  };
}
