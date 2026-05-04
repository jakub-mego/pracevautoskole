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
  courtInterpreterProfiles,
} from "../../../drizzle/schema";

const IcoSchema = z.string().trim().regex(/^\d{8}$/, "IČO musí mít 8 číslic.");

const ProfessionalRoleSchema = z.enum([
  "instructor",
  "examiner",
  "operator_admin",
  "lecturer_48",
  "manager",
  "medic",
  "court_interpreter",
  "other",
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
  contactPerson: z.string().trim().max(120).optional().or(z.literal("")),
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
    contactPerson: formData.get("contactPerson") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const { ico, displayName, city, contactPerson } = parsed.data;

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
        contactPerson: contactPerson || null,
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

const OtherWorkerInputSchema = z.object({
  displayName: z.string().trim().min(2, "Zadej jméno min. 2 znaky.").max(120),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  region: z.string().trim().max(80).optional().or(z.literal("")),
});

export async function createOtherWorkerProfileAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const userId = session.user.id;

  const existing = await getProfileByUserId(userId);
  if (existing) redirect("/dashboard");

  const parsed = OtherWorkerInputSchema.safeParse({
    displayName: formData.get("displayName"),
    city: formData.get("city") ?? "",
    region: formData.get("region") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const { displayName, city, region } = parsed.data;

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
        anonymous: false,
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Vytvoření profilu selhalo.";
    return { error: message };
  }

  redirect("/dashboard");
}

const OtherRoleChoiceSchema = z.object({
  choice: z.enum(["operator_admin", "medic", "other"]),
  customLabel: z.string().trim().max(80).optional().or(z.literal("")),
});

export async function setOtherWorkerRoleAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile || profile.type !== "professional") {
    return { error: "Tato akce je dostupná jen profesionálovi." };
  }

  const parsed = OtherRoleChoiceSchema.safeParse({
    choice: formData.get("choice"),
    customLabel: formData.get("customLabel") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const { choice, customLabel } = parsed.data;
  if (choice === "other" && !(customLabel && customLabel.length >= 2)) {
    return { error: "U volby 'Jiné' napiš krátký popis role (min. 2 znaky)." };
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(professionalRoles)
        .where(eq(professionalRoles.profileId, profile.id));
      await tx.insert(professionalRoles).values({
        id: newId(),
        profileId: profile.id,
        role: choice,
      });
      await tx
        .update(professionalProfiles)
        .set({
          customRoleLabel: choice === "other" ? customLabel || null : null,
          updatedAt: new Date(),
        })
        .where(eq(professionalProfiles.profileId, profile.id));
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Uložení role selhalo.",
    };
  }

  return undefined;
}

const PriceSchema = z.coerce
  .number()
  .int("Zadej celé číslo v Kč.")
  .min(0, "Cena nemůže být záporná.")
  .max(1_000_000, "Cena je mimo realistický rozsah.")
  .optional();

function splitListInput(raw: FormDataEntryValue | null, max: number): string[] {
  if (raw == null) return [];
  return String(raw)
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

const CourtInterpreterInputSchema = z.object({
  displayName: z.string().trim().min(2, "Zadej jméno min. 2 znaky.").max(120),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  region: z.string().trim().max(80).optional().or(z.literal("")),
  testTranslationPriceCzk: PriceSchema,
  examTranslationPriceCzk: PriceSchema,
  languages: z.array(z.string().trim().min(1).max(60)).min(1, "Přidej alespoň jeden jazyk."),
  cities: z.array(z.string().trim().min(1).max(80)).min(1, "Přidej alespoň jedno město působnosti."),
});

export async function createCourtInterpreterProfileAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await requireSession();
  const userId = session.user.id;

  const existing = await getProfileByUserId(userId);
  if (existing) redirect("/dashboard");

  const parsed = CourtInterpreterInputSchema.safeParse({
    displayName: formData.get("displayName"),
    city: formData.get("city") ?? "",
    region: formData.get("region") ?? "",
    testTranslationPriceCzk: formData.get("testTranslationPriceCzk") || undefined,
    examTranslationPriceCzk: formData.get("examTranslationPriceCzk") || undefined,
    languages: splitListInput(formData.get("languages"), 30),
    cities: splitListInput(formData.get("cities"), 50),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const {
    displayName,
    city,
    region,
    testTranslationPriceCzk,
    examTranslationPriceCzk,
    languages,
    cities,
  } = parsed.data;

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
        anonymous: false,
      });
      await tx.insert(professionalRoles).values({
        id: newId(),
        profileId,
        role: "court_interpreter",
      });
      await tx.insert(courtInterpreterProfiles).values({
        profileId,
        testTranslationPriceCzk: testTranslationPriceCzk ?? null,
        examTranslationPriceCzk: examTranslationPriceCzk ?? null,
        languages,
        cities,
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Vytvoření profilu selhalo.";
    return { error: message };
  }

  redirect("/dashboard");
}
