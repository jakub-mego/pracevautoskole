"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { newId } from "@/lib/utils/id";
import { computeMatchesForListing } from "@/lib/matching/queries";
import { countPublishedListings } from "@/lib/listings/queries";
import { computeListingPublishPriceCzk } from "@/lib/payments/products";
import {
  listings,
  listingRoles,
  listingLicenses,
  matches,
} from "../../../drizzle/schema";

const RoleSchema = z.enum([
  "instructor",
  "examiner",
  "operator_admin",
  "lecturer_48",
  "manager",
  "medic",
  "court_interpreter",
  "other",
]);

const LicenseSchema = z.enum([
  "AM", "A1", "A2", "A",
  "B1", "B", "BE",
  "C1", "C1E", "C", "CE",
  "D1", "D1E", "D", "DE",
  "T",
]);

const optionalInt = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().nonnegative().max(100000).optional(),
);

const optionalDate = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : new Date(String(v))),
  z.date().optional(),
);

const IntentSchema = z.enum(["job", "course"]);

const ListingInputSchema = z
  .object({
    intent: IntentSchema.default("job"),
    title: z.string().trim().min(5, "Titulek aspoň 5 znaků.").max(140),
    description: z.string().trim().min(20, "Popis aspoň 20 znaků.").max(8000),
    region: z.string().trim().max(80).optional().or(z.literal("")),
    city: z.string().trim().max(80).optional().or(z.literal("")),
    postalCode: z.string().trim().max(10).optional().or(z.literal("")),
    remoteFriendly: z.coerce.boolean().optional(),
    travelRadiusKm: optionalInt,
    rateTheoryMin: optionalInt,
    rateTheoryMax: optionalInt,
    ratePracticeMin: optionalInt,
    ratePracticeMax: optionalInt,
    rateHealthMin: optionalInt,
    rateHealthMax: optionalInt,
    employmentType: z.string().trim().max(40).optional().or(z.literal("")),
    startAvailability: z.string().trim().max(120).optional().or(z.literal("")),
    roles: z.array(RoleSchema).default([]),
    licenses: z.array(LicenseSchema).default([]),
    coursePriceCzk: optionalInt,
    courseStartDate: optionalDate,
    courseDurationHours: optionalInt,
  })
  .refine(
    (d) => d.intent === "course" || d.roles.length >= 1,
    {
      message: "Vyber alespoň jednu roli.",
      path: ["roles"],
    },
  );

function parseFromForm(formData: FormData) {
  return ListingInputSchema.safeParse({
    intent: formData.get("intent") ?? "job",
    title: formData.get("title"),
    description: formData.get("description"),
    region: formData.get("region") ?? "",
    city: formData.get("city") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    remoteFriendly: formData.get("remoteFriendly") === "on",
    travelRadiusKm: formData.get("travelRadiusKm"),
    rateTheoryMin: formData.get("rateTheoryMin"),
    rateTheoryMax: formData.get("rateTheoryMax"),
    ratePracticeMin: formData.get("ratePracticeMin"),
    ratePracticeMax: formData.get("ratePracticeMax"),
    rateHealthMin: formData.get("rateHealthMin"),
    rateHealthMax: formData.get("rateHealthMax"),
    employmentType: formData.get("employmentType") ?? "",
    startAvailability: formData.get("startAvailability") ?? "",
    roles: formData.getAll("roles"),
    licenses: formData.getAll("licenses"),
    coursePriceCzk: formData.get("coursePriceCzk"),
    courseStartDate: formData.get("courseStartDate") ?? "",
    courseDurationHours: formData.get("courseDurationHours"),
  });
}

async function ownProfileOrRedirect() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");
  return profile;
}

export type FormActionState = { error?: string } | undefined;

export async function createListingAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const profile = await ownProfileOrRedirect();
  const parsed = parseFromForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const data = parsed.data;

  // Kurz může inzerovat jen autoškola (employer)
  if (data.intent === "course" && profile.type !== "employer") {
    return { error: "Kurz pro učitele může inzerovat pouze autoškola." };
  }

  const listingType =
    data.intent === "course"
      ? "employer_course"
      : profile.type === "employer"
        ? "employer_seeks"
        : "professional_seeks";

  const id = newId();
  try {
    await db.transaction(async (tx) => {
      await tx.insert(listings).values({
        id,
        profileId: profile.id,
        type: listingType,
        status: "draft",
        title: data.title,
        description: data.description,
        region: data.region || null,
        city: data.city || null,
        postalCode: data.postalCode || null,
        remoteFriendly: data.remoteFriendly ? 1 : 0,
        travelRadiusKm: data.travelRadiusKm ?? null,
        rateTheoryMin: data.rateTheoryMin ?? null,
        rateTheoryMax: data.rateTheoryMax ?? null,
        ratePracticeMin: data.ratePracticeMin ?? null,
        ratePracticeMax: data.ratePracticeMax ?? null,
        rateHealthMin: data.rateHealthMin ?? null,
        rateHealthMax: data.rateHealthMax ?? null,
        employmentType: data.employmentType || null,
        startAvailability: data.startAvailability || null,
        coursePriceCzk: data.intent === "course" ? data.coursePriceCzk ?? null : null,
        courseStartDate: data.intent === "course" ? data.courseStartDate ?? null : null,
        courseDurationHours:
          data.intent === "course" ? data.courseDurationHours ?? null : null,
      });
      if (data.roles.length) {
        await tx.insert(listingRoles).values(
          data.roles.map((role) => ({ id: newId(), listingId: id, role })),
        );
      }
      if (data.licenses.length) {
        await tx.insert(listingLicenses).values(
          data.licenses.map((category) => ({ id: newId(), listingId: id, category })),
        );
      }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Uložení selhalo." };
  }

  redirect(`/listings/${id}/edit`);
}

export async function updateListingAction(
  id: string,
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const profile = await ownProfileOrRedirect();
  const parsed = parseFromForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const data = parsed.data;

  const owned = await db
    .select({ id: listings.id })
    .from(listings)
    .where(and(eq(listings.id, id), eq(listings.profileId, profile.id)))
    .limit(1);
  if (!owned[0]) return { error: "Inzerát nenalezen." };

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(listings)
        .set({
          title: data.title,
          description: data.description,
          region: data.region || null,
          city: data.city || null,
          postalCode: data.postalCode || null,
          remoteFriendly: data.remoteFriendly ? 1 : 0,
          travelRadiusKm: data.travelRadiusKm ?? null,
          rateTheoryMin: data.rateTheoryMin ?? null,
          rateTheoryMax: data.rateTheoryMax ?? null,
          ratePracticeMin: data.ratePracticeMin ?? null,
          ratePracticeMax: data.ratePracticeMax ?? null,
          rateHealthMin: data.rateHealthMin ?? null,
          rateHealthMax: data.rateHealthMax ?? null,
          employmentType: data.employmentType || null,
          startAvailability: data.startAvailability || null,
          coursePriceCzk: data.intent === "course" ? data.coursePriceCzk ?? null : null,
          courseStartDate: data.intent === "course" ? data.courseStartDate ?? null : null,
          courseDurationHours:
            data.intent === "course" ? data.courseDurationHours ?? null : null,
          updatedAt: new Date(),
        })
        .where(eq(listings.id, id));
      await tx.delete(listingRoles).where(eq(listingRoles.listingId, id));
      await tx.delete(listingLicenses).where(eq(listingLicenses.listingId, id));
      if (data.roles.length) {
        await tx.insert(listingRoles).values(
          data.roles.map((role) => ({ id: newId(), listingId: id, role })),
        );
      }
      if (data.licenses.length) {
        await tx.insert(listingLicenses).values(
          data.licenses.map((category) => ({ id: newId(), listingId: id, category })),
        );
      }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Uložení selhalo." };
  }

  revalidatePath(`/listings/${id}/edit`);
  revalidatePath(`/inzeraty/${id}`);
  return { error: undefined };
}

async function setListingStatus(
  id: string,
  status: "active" | "paused" | "archived" | "pending_payment",
) {
  const profile = await ownProfileOrRedirect();
  const owned = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, id), eq(listings.profileId, profile.id)))
    .limit(1);
  const listing = owned[0];
  if (!listing) return;

  const now = new Date();
  const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  await db
    .update(listings)
    .set({
      status,
      publishedAt:
        status === "active" && !listing.publishedAt ? now : listing.publishedAt,
      expiresAt: status === "active" ? ninetyDays : listing.expiresAt,
      updatedAt: now,
    })
    .where(eq(listings.id, id));

  if (status === "active") {
    try {
      await computeMatchesForListing(id);
    } catch (err) {
      console.error("[matching] recompute failed", { listingId: id, err });
    }
  } else {
    await db.delete(matches).where(eq(matches.listingId, id));
  }

  revalidatePath("/listings");
  revalidatePath("/inzeraty");
  revalidatePath(`/inzeraty/${id}`);
  revalidatePath("/dashboard");
}

export type PublishResult =
  | { error: string }
  | undefined;

export async function publishListingAction(id: string): Promise<PublishResult> {
  const session = await requireSession();
  if (!session.user.emailVerified) {
    return {
      error:
        "Pro zveřejnění inzerátu si nejdřív ověř e-mail. Odkaz pošleme po kliknutí na žluté tlačítko v hlavičce.",
    };
  }

  const profile = await ownProfileOrRedirect();
  const owned = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, id), eq(listings.profileId, profile.id)))
    .limit(1);
  const listing = owned[0];
  if (!listing) return { error: "Inzerát nenalezen." };

  // Re-publish (paused/expired → active) je vždy zdarma — slot je už spotřebovaný.
  const isFirstPublish = !listing.publishedAt;

  if (isFirstPublish && profile.type !== "employer" && profile.type !== "professional") {
    return { error: "Neznámý typ profilu pro pricing." };
  }

  if (isFirstPublish) {
    const publishedCount = await countPublishedListings(profile.id);
    const priceCzk = computeListingPublishPriceCzk({
      profileType: profile.type as "employer" | "professional",
      listingType: listing.type as
        | "employer_seeks"
        | "professional_seeks"
        | "employer_course",
      alreadyPublishedCount: publishedCount,
    });
    if (priceCzk > 0) {
      // Placený slot — nastavíme pending_payment a redirect na platbu.
      await setListingStatus(id, "pending_payment");
      redirect(`/payments?listingId=${id}`);
    }
  }

  await setListingStatus(id, "active");
  redirect(`/inzeraty/${id}`);
}

export async function pauseListingAction(id: string) {
  await setListingStatus(id, "paused");
  redirect("/listings");
}

export async function archiveListingAction(id: string) {
  await setListingStatus(id, "archived");
  redirect("/listings");
}

export async function deleteListingAction(id: string) {
  const profile = await ownProfileOrRedirect();
  await db
    .delete(listings)
    .where(and(eq(listings.id, id), eq(listings.profileId, profile.id)));
  revalidatePath("/listings");
  redirect("/listings");
}
