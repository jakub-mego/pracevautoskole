import "server-only";
import { and, desc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { newId } from "@/lib/utils/id";
import {
  listings,
  listingRoles,
  listingLicenses,
  matches,
  profiles,
  professionalProfiles,
  professionalRoles,
  professionalLicenses,
  employerProfiles,
} from "../../../drizzle/schema";
import {
  MATCH_MIN_SCORE,
  scoreMatch,
  type LicenseCategory,
  type ProfessionalRole,
  type ScoreCounterpart,
  type ScoreReason,
  type ScoreSubject,
} from "./score";

type ListingRow = typeof listings.$inferSelect;

const notExpired = () =>
  or(isNull(listings.expiresAt), gt(listings.expiresAt, new Date()));

function rateFromListing(l: Pick<
  ListingRow,
  | "rateTheoryMin" | "rateTheoryMax"
  | "ratePracticeMin" | "ratePracticeMax"
  | "rateHealthMin" | "rateHealthMax"
>) {
  const mins = [l.rateTheoryMin, l.ratePracticeMin, l.rateHealthMin].filter(
    (n): n is number => typeof n === "number",
  );
  const maxs = [l.rateTheoryMax, l.ratePracticeMax, l.rateHealthMax].filter(
    (n): n is number => typeof n === "number",
  );
  if (mins.length === 0 && maxs.length === 0) return null;
  return {
    min: mins.length ? Math.min(...mins) : null,
    max: maxs.length ? Math.max(...maxs) : null,
  };
}

async function loadListingSubject(
  listingId: string,
): Promise<(ScoreSubject & { row: ListingRow }) | null> {
  const row = (
    await db.select().from(listings).where(eq(listings.id, listingId)).limit(1)
  )[0];
  if (!row) return null;
  const [rolesRows, licensesRows] = await Promise.all([
    db.select({ role: listingRoles.role }).from(listingRoles).where(eq(listingRoles.listingId, listingId)),
    db.select({ category: listingLicenses.category }).from(listingLicenses).where(eq(listingLicenses.listingId, listingId)),
  ]);
  return {
    row,
    region: row.region,
    city: row.city,
    roles: rolesRows.map((r) => r.role) as ProfessionalRole[],
    licenses: licensesRows.map((l) => l.category) as LicenseCategory[],
    rate: rateFromListing(row),
  };
}

type CounterpartCandidate = ScoreCounterpart & { profileId: string };

/**
 * Načte kandidáty na protistranu pro daný typ inzerátu:
 * - employer_seeks → profesionálové (profile + jejich nejnovější aktivní inzerát pro sazby/lokalitu)
 * - professional_seeks → autoškoly s ARES ověřením + jejich nejnovější aktivní inzerát
 */
async function loadCounterparts(
  listingType: "employer_seeks" | "professional_seeks",
): Promise<CounterpartCandidate[]> {
  if (listingType === "employer_seeks") {
    const profileRows = await db
      .select({
        profileId: profiles.id,
        region: profiles.region,
        city: profiles.city,
        verification: professionalProfiles.credentialsVerification,
      })
      .from(profiles)
      .innerJoin(
        professionalProfiles,
        eq(professionalProfiles.profileId, profiles.id),
      )
      .where(eq(profiles.type, "professional"));

    if (profileRows.length === 0) return [];
    const ids = profileRows.map((p) => p.profileId);

    const [rolesRows, licenseRows, listingRows] = await Promise.all([
      db
        .select({
          profileId: professionalRoles.profileId,
          role: professionalRoles.role,
        })
        .from(professionalRoles)
        .where(inArray(professionalRoles.profileId, ids)),
      db
        .select({
          profileId: professionalLicenses.profileId,
          category: professionalLicenses.category,
        })
        .from(professionalLicenses)
        .where(inArray(professionalLicenses.profileId, ids)),
      db
        .select()
        .from(listings)
        .where(
          and(
            inArray(listings.profileId, ids),
            eq(listings.type, "professional_seeks"),
            eq(listings.status, "active"),
            notExpired(),
          ),
        ),
    ]);

    const rolesMap = new Map<string, ProfessionalRole[]>();
    for (const r of rolesRows) {
      const arr = rolesMap.get(r.profileId) ?? [];
      arr.push(r.role as ProfessionalRole);
      rolesMap.set(r.profileId, arr);
    }
    const licensesMap = new Map<string, LicenseCategory[]>();
    for (const r of licenseRows) {
      const arr = licensesMap.get(r.profileId) ?? [];
      arr.push(r.category as LicenseCategory);
      licensesMap.set(r.profileId, arr);
    }
    const listingByProfile = new Map<string, ListingRow>();
    for (const l of listingRows) {
      const prev = listingByProfile.get(l.profileId);
      if (!prev || (l.publishedAt && prev.publishedAt && l.publishedAt > prev.publishedAt)) {
        listingByProfile.set(l.profileId, l);
      }
    }

    return profileRows.map((p) => {
      const seekListing = listingByProfile.get(p.profileId);
      return {
        profileId: p.profileId,
        region: seekListing?.region ?? p.region,
        city: seekListing?.city ?? p.city,
        roles: rolesMap.get(p.profileId) ?? [],
        licenses: licensesMap.get(p.profileId) ?? [],
        rate: seekListing ? rateFromListing(seekListing) : null,
        verified: p.verification === "verified",
      };
    });
  }

  // professional_seeks → counterparts jsou autoškoly
  const employers = await db
    .select({
      profileId: profiles.id,
      region: profiles.region,
      city: profiles.city,
      aresVerifiedAt: employerProfiles.aresVerifiedAt,
    })
    .from(profiles)
    .innerJoin(employerProfiles, eq(employerProfiles.profileId, profiles.id))
    .where(eq(profiles.type, "employer"));
  if (employers.length === 0) return [];
  const ids = employers.map((e) => e.profileId);

  const seekRows = await db
    .select()
    .from(listings)
    .where(
      and(
        inArray(listings.profileId, ids),
        eq(listings.type, "employer_seeks"),
        eq(listings.status, "active"),
        notExpired(),
      ),
    );

  if (seekRows.length === 0) return [];
  const listingIds = seekRows.map((l) => l.id);
  const [rolesRows, licenseRows] = await Promise.all([
    db
      .select({ listingId: listingRoles.listingId, role: listingRoles.role })
      .from(listingRoles)
      .where(inArray(listingRoles.listingId, listingIds)),
    db
      .select({
        listingId: listingLicenses.listingId,
        category: listingLicenses.category,
      })
      .from(listingLicenses)
      .where(inArray(listingLicenses.listingId, listingIds)),
  ]);
  const rolesByListing = new Map<string, ProfessionalRole[]>();
  for (const r of rolesRows) {
    const arr = rolesByListing.get(r.listingId) ?? [];
    arr.push(r.role as ProfessionalRole);
    rolesByListing.set(r.listingId, arr);
  }
  const licensesByListing = new Map<string, LicenseCategory[]>();
  for (const r of licenseRows) {
    const arr = licensesByListing.get(r.listingId) ?? [];
    arr.push(r.category as LicenseCategory);
    licensesByListing.set(r.listingId, arr);
  }

  // Slouč inzeráty každého employera (union rolí/ŘP, nejširší rozsah sazeb)
  const aggregated = new Map<
    string,
    { roles: Set<ProfessionalRole>; licenses: Set<LicenseCategory>; rateMin: number | null; rateMax: number | null; region: string | null; city: string | null }
  >();
  for (const l of seekRows) {
    const entry =
      aggregated.get(l.profileId) ??
      {
        roles: new Set<ProfessionalRole>(),
        licenses: new Set<LicenseCategory>(),
        rateMin: null as number | null,
        rateMax: null as number | null,
        region: l.region,
        city: l.city,
      };
    for (const r of rolesByListing.get(l.id) ?? []) entry.roles.add(r);
    for (const c of licensesByListing.get(l.id) ?? []) entry.licenses.add(c);
    const rate = rateFromListing(l);
    if (rate?.min != null) {
      entry.rateMin = entry.rateMin == null ? rate.min : Math.min(entry.rateMin, rate.min);
    }
    if (rate?.max != null) {
      entry.rateMax = entry.rateMax == null ? rate.max : Math.max(entry.rateMax, rate.max);
    }
    aggregated.set(l.profileId, entry);
  }

  return employers
    .filter((e) => aggregated.has(e.profileId))
    .map((e) => {
      const agg = aggregated.get(e.profileId)!;
      return {
        profileId: e.profileId,
        region: agg.region ?? e.region,
        city: agg.city ?? e.city,
        roles: Array.from(agg.roles),
        licenses: Array.from(agg.licenses),
        rate:
          agg.rateMin != null || agg.rateMax != null
            ? { min: agg.rateMin, max: agg.rateMax }
            : null,
        verified: Boolean(e.aresVerifiedAt),
      };
    });
}

/**
 * Spočítá matching pro inzerát proti všem aktuálním kandidátům protistrany.
 * Persistuje pouze záznamy se skóre ≥ MATCH_MIN_SCORE; ostatní mazaní.
 */
export async function computeMatchesForListing(listingId: string): Promise<number> {
  const subject = await loadListingSubject(listingId);
  if (!subject) return 0;
  if (subject.row.status !== "active") {
    await db.delete(matches).where(eq(matches.listingId, listingId));
    return 0;
  }

  const candidates = await loadCounterparts(subject.row.type);
  const now = new Date();
  const rows: { id: string; listingId: string; counterpartProfileId: string; score: number; reasons: ScoreReason[]; computedAt: Date }[] = [];

  for (const c of candidates) {
    if (c.profileId === subject.row.profileId) continue;
    const result = scoreMatch(subject, c);
    if (result.score < MATCH_MIN_SCORE) continue;
    rows.push({
      id: newId(),
      listingId,
      counterpartProfileId: c.profileId,
      score: result.score,
      reasons: result.reasons,
      computedAt: now,
    });
  }

  await db.transaction(async (tx) => {
    await tx.delete(matches).where(eq(matches.listingId, listingId));
    if (rows.length) {
      await tx.insert(matches).values(rows);
    }
  });

  return rows.length;
}

export type Recommendation = {
  match: typeof matches.$inferSelect;
  listing: ListingRow;
  ownerProfile: typeof profiles.$inferSelect;
  ownerAnonymous: boolean;
};

/**
 * Po významné změně profilu recomputne matche pro všechny aktivní inzeráty
 * protistrany. Volat fire-and-forget, ať se nezdrží odpověď formuláře.
 */
export async function recomputeMatchesForCounterpartProfile(
  profileType: "employer" | "professional",
): Promise<number> {
  const oppositeListingType =
    profileType === "professional" ? "employer_seeks" : "professional_seeks";
  const rows = await db
    .select({ id: listings.id })
    .from(listings)
    .where(
      and(
        eq(listings.type, oppositeListingType),
        eq(listings.status, "active"),
        notExpired(),
      ),
    );
  let total = 0;
  for (const r of rows) {
    try {
      total += await computeMatchesForListing(r.id);
    } catch (err) {
      console.error("[matching] recompute failed", { listingId: r.id, err });
    }
  }
  return total;
}

/**
 * Doporučení pro daný profil — top inzeráty protistrany, kde je tento profil counterpart.
 */
export async function getRecommendationsForProfile(
  profileId: string,
  limit = 5,
): Promise<Recommendation[]> {
  const rows = await db
    .select({
      match: matches,
      listing: listings,
      ownerProfile: profiles,
      anonymous: professionalProfiles.anonymous,
    })
    .from(matches)
    .innerJoin(listings, eq(listings.id, matches.listingId))
    .innerJoin(profiles, eq(profiles.id, listings.profileId))
    .leftJoin(
      professionalProfiles,
      eq(professionalProfiles.profileId, profiles.id),
    )
    .where(
      and(
        eq(matches.counterpartProfileId, profileId),
        eq(listings.status, "active"),
        notExpired(),
      ),
    )
    .orderBy(desc(matches.score), desc(matches.computedAt))
    .limit(limit);

  return rows.map((r) => ({
    match: r.match,
    listing: r.listing,
    ownerProfile: r.ownerProfile,
    ownerAnonymous: r.anonymous ?? false,
  }));
}
