import "server-only";
import { and, eq, desc, gt, ilike, isNull, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  listings,
  listingRoles,
  listingLicenses,
  profiles,
  professionalProfiles,
  employerProfiles,
} from "../../../drizzle/schema";
import type { ProfessionalRole } from "@/lib/matching/score";

const notExpired = () =>
  or(isNull(listings.expiresAt), gt(listings.expiresAt, new Date()));

export async function getListingsForProfile(profileId: string) {
  return db
    .select()
    .from(listings)
    .where(eq(listings.profileId, profileId))
    .orderBy(desc(listings.updatedAt));
}

export async function getOwnedListing(id: string, profileId: string) {
  const rows = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, id), eq(listings.profileId, profileId)))
    .limit(1);
  const listing = rows[0];
  if (!listing) return null;
  const [rolesRows, licensesRows] = await Promise.all([
    db
      .select({ role: listingRoles.role })
      .from(listingRoles)
      .where(eq(listingRoles.listingId, id)),
    db
      .select({ category: listingLicenses.category })
      .from(listingLicenses)
      .where(eq(listingLicenses.listingId, id)),
  ]);
  return {
    listing,
    roles: rolesRows.map((r) => r.role),
    licenses: licensesRows.map((l) => l.category),
  };
}

export async function getPublicListing(id: string) {
  const rows = await db
    .select({
      listing: listings,
      profile: profiles,
      aresVerifiedAt: employerProfiles.aresVerifiedAt,
    })
    .from(listings)
    .innerJoin(profiles, eq(profiles.id, listings.profileId))
    .leftJoin(
      employerProfiles,
      eq(employerProfiles.profileId, profiles.id),
    )
    .where(
      and(
        eq(listings.id, id),
        eq(listings.status, "active"),
        notExpired(),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const [rolesRows, licensesRows, proRows] = await Promise.all([
    db
      .select({ role: listingRoles.role })
      .from(listingRoles)
      .where(eq(listingRoles.listingId, id)),
    db
      .select({ category: listingLicenses.category })
      .from(listingLicenses)
      .where(eq(listingLicenses.listingId, id)),
    row.profile.type === "professional"
      ? db
          .select({
            anonymous: professionalProfiles.anonymous,
            verification: professionalProfiles.credentialsVerification,
          })
          .from(professionalProfiles)
          .where(eq(professionalProfiles.profileId, row.profile.id))
          .limit(1)
      : Promise.resolve([] as { anonymous: boolean; verification: string }[]),
  ]);
  return {
    listing: row.listing,
    profile: row.profile,
    roles: rolesRows.map((r) => r.role),
    licenses: licensesRows.map((l) => l.category),
    anonymous: proRows[0]?.anonymous ?? false,
    aresVerified: Boolean(row.aresVerifiedAt),
    professionalVerified: proRows[0]?.verification === "verified",
  };
}

export async function listActiveListingsByProfile(profileId: string) {
  return db
    .select()
    .from(listings)
    .where(
      and(
        eq(listings.profileId, profileId),
        eq(listings.status, "active"),
        notExpired(),
      ),
    )
    .orderBy(desc(listings.publishedAt));
}

export type PublicListFilters = {
  type?: "employer_seeks" | "professional_seeks";
  region?: string;
  page?: number;
  perPage?: number;
};

/**
 * Počet inzerátů, které profil už zveřejnil (publishedAt != null).
 * Slouží pro počítání free quoty (první 3 inzeráty zdarma).
 */
export async function countPublishedListings(profileId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .where(
      and(
        eq(listings.profileId, profileId),
        sql`${listings.publishedAt} is not null`,
      ),
    );
  return row?.count ?? 0;
}

export async function getListingStatsForProfile(profileId: string) {
  const [active] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .where(
      and(
        eq(listings.profileId, profileId),
        eq(listings.status, "active"),
        notExpired(),
      ),
    );
  const [pending] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .where(
      and(
        eq(listings.profileId, profileId),
        eq(listings.status, "pending_payment"),
      ),
    );
  const [draft] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .where(
      and(eq(listings.profileId, profileId), eq(listings.status, "draft")),
    );
  return {
    active: active?.count ?? 0,
    pendingPayment: pending?.count ?? 0,
    draft: draft?.count ?? 0,
  };
}

export async function listLandingListings(args: {
  role?: ProfessionalRole;
  cityName?: string;
  regionName?: string;
  limit?: number;
}) {
  const limit = args.limit ?? 12;
  const where = [eq(listings.status, "active"), notExpired()];
  if (args.cityName) where.push(ilike(listings.city, args.cityName));
  if (args.regionName && !args.cityName)
    where.push(ilike(listings.region, args.regionName));

  const baseQuery = db
    .select({
      listing: listings,
      profile: profiles,
      anonymous: professionalProfiles.anonymous,
      professionalVerification: professionalProfiles.credentialsVerification,
      aresVerifiedAt: employerProfiles.aresVerifiedAt,
    })
    .from(listings)
    .innerJoin(profiles, eq(profiles.id, listings.profileId))
    .leftJoin(
      professionalProfiles,
      eq(professionalProfiles.profileId, profiles.id),
    )
    .leftJoin(employerProfiles, eq(employerProfiles.profileId, profiles.id));

  if (args.role) {
    const role = args.role;
    return baseQuery
      .innerJoin(listingRoles, eq(listingRoles.listingId, listings.id))
      .where(and(...where, eq(listingRoles.role, role)))
      .orderBy(desc(listings.publishedAt))
      .limit(limit);
  }

  return baseQuery
    .where(and(...where))
    .orderBy(desc(listings.publishedAt))
    .limit(limit);
}

export async function listPublicListings(filters: PublicListFilters = {}) {
  const perPage = Math.min(Math.max(filters.perPage ?? 20, 1), 50);
  const page = Math.max(filters.page ?? 1, 1);
  const offset = (page - 1) * perPage;

  const where = [eq(listings.status, "active"), notExpired()];
  if (filters.type) where.push(eq(listings.type, filters.type));
  if (filters.region) where.push(eq(listings.region, filters.region));

  const rows = await db
    .select({
      listing: listings,
      profile: profiles,
      anonymous: professionalProfiles.anonymous,
      professionalVerification: professionalProfiles.credentialsVerification,
      aresVerifiedAt: employerProfiles.aresVerifiedAt,
    })
    .from(listings)
    .innerJoin(profiles, eq(profiles.id, listings.profileId))
    .leftJoin(
      professionalProfiles,
      eq(professionalProfiles.profileId, profiles.id),
    )
    .leftJoin(
      employerProfiles,
      eq(employerProfiles.profileId, profiles.id),
    )
    .where(and(...where))
    .orderBy(desc(listings.publishedAt))
    .limit(perPage)
    .offset(offset);

  const totalRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .where(and(...where));
  const total = totalRows[0]?.count ?? 0;

  return { rows, total, page, perPage };
}
