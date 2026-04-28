"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { lookupIco, type AresSubject } from "@/lib/ares/client";
import { newId } from "@/lib/utils/id";
import { uniqueSlug } from "@/lib/utils/slug";
import {
  profiles,
  employerProfiles,
  professionalProfiles,
  professionalRoles,
  professionalLicenses,
} from "../../../drizzle/schema";

const IcoSchema = z.string().trim().regex(/^\d{8}$/, "IČO musí mít 8 číslic.");

const ProfessionalRoleSchema = z.enum([
  "instructor",
  "master_practice",
  "operator_admin",
  "lecturer_48",
  "manager",
  "medic",
]);

const LicenseCategorySchema = z.enum([
  "AM", "A1", "A2", "A",
  "B1", "B", "BE",
  "C1", "C1E", "C", "CE",
  "D1", "D1E", "D", "DE",
  "T",
]);

export type LookupResult =
  | { ok: true; subject: AresSubject }
  | { ok: false; error: string };

export async function lookupIcoAction(rawIco: string): Promise<LookupResult> {
  await requireSession();
  const parsed = IcoSchema.safeParse(rawIco);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neplatné IČO." };
  }
  try {
    const subject = await lookupIco(parsed.data);
    if (!subject) return { ok: false, error: "Subjekt v ARES nenalezen nebo zanikl." };
    return { ok: true, subject };
  } catch (err) {
    const message = err instanceof Error ? err.message : "ARES selhal.";
    return { ok: false, error: message };
  }
}

const EmployerInputSchema = z.object({
  ico: IcoSchema,
  displayName: z.string().trim().min(2, "Zadej název min. 2 znaky.").max(120),
  city: z.string().trim().max(80).optional().or(z.literal("")),
});

export type FormActionState = { error?: string } | undefined;

export async function createEmployerProfileAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const userId = session.user.id;

  const existing = await getProfileByUserId(userId);
  if (existing) redirect("/dashboard");

  const parsed = EmployerInputSchema.safeParse({
    ico: formData.get("ico"),
    displayName: formData.get("displayName"),
    city: formData.get("city") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const { ico, displayName, city } = parsed.data;

  const subject = await lookupIco(ico);
  if (!subject) return { error: "ARES subjekt nenalezen nebo zanikl." };

  const profileId = newId();
  const slug = uniqueSlug(displayName);
  const aresCity = subject.sidlo?.nazevObce;
  const aresPsc = subject.sidlo?.psc?.toString();

  try {
    await db.transaction(async (tx) => {
      await tx.insert(profiles).values({
        id: profileId,
        userId,
        type: "employer",
        slug,
        displayName,
        city: city || aresCity || null,
        postalCode: aresPsc ?? null,
      });
      await tx.insert(employerProfiles).values({
        profileId,
        ico: subject.ico,
        legalName: subject.obchodniJmeno,
        aresVerifiedAt: new Date(),
        aresSnapshot: subject,
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Vytvoření profilu selhalo.";
    if (message.includes("employer_ico_idx") || message.toLowerCase().includes("unique")) {
      return { error: "Tento subjekt už je v systému zaregistrovaný." };
    }
    return { error: message };
  }

  redirect("/dashboard");
}

const ProfessionalInputSchema = z.object({
  displayName: z.string().trim().min(2, "Zadej jméno min. 2 znaky.").max(120),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  region: z.string().trim().max(80).optional().or(z.literal("")),
  anonymous: z.coerce.boolean().optional(),
  roles: z.array(ProfessionalRoleSchema).min(1, "Vyber alespoň jednu roli."),
  licenses: z.array(LicenseCategorySchema).default([]),
});

export async function createProfessionalProfileAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const userId = session.user.id;

  const existing = await getProfileByUserId(userId);
  if (existing) redirect("/dashboard");

  const parsed = ProfessionalInputSchema.safeParse({
    displayName: formData.get("displayName"),
    city: formData.get("city") ?? "",
    region: formData.get("region") ?? "",
    anonymous: formData.get("anonymous") === "on",
    roles: formData.getAll("roles"),
    licenses: formData.getAll("licenses"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const { displayName, city, region, anonymous, roles, licenses } = parsed.data;

  const profileId = newId();
  const slug = uniqueSlug(displayName);

  try {
    await db.transaction(async (tx) => {
      await tx.insert(profiles).values({
        id: profileId,
        userId,
        type: "professional",
        slug,
        displayName,
        city: city || null,
        region: region || null,
      });
      await tx.insert(professionalProfiles).values({
        profileId,
        anonymous: anonymous ?? false,
      });
      if (roles.length) {
        await tx.insert(professionalRoles).values(
          roles.map((role) => ({ id: newId(), profileId, role })),
        );
      }
      if (licenses.length) {
        await tx.insert(professionalLicenses).values(
          licenses.map((category) => ({ id: newId(), profileId, category })),
        );
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Vytvoření profilu selhalo.";
    return { error: message };
  }

  redirect("/dashboard");
}
