import "server-only";
import { and, eq, gt, isNull, or, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  listings,
  profiles,
  professionalProfiles,
} from "../../../drizzle/schema";

export async function listSitemapListings() {
  return db
    .select({ id: listings.id, updatedAt: listings.updatedAt })
    .from(listings)
    .where(
      and(
        eq(listings.status, "active"),
        or(isNull(listings.expiresAt), gt(listings.expiresAt, new Date())),
      ),
    )
    .orderBy(desc(listings.publishedAt))
    .limit(5000);
}

export async function listSitemapProfiles() {
  return db
    .select({
      slug: profiles.slug,
      updatedAt: profiles.updatedAt,
    })
    .from(profiles)
    .leftJoin(
      professionalProfiles,
      eq(professionalProfiles.profileId, profiles.id),
    )
    .where(
      or(
        eq(profiles.type, "employer"),
        and(
          eq(profiles.type, "professional"),
          or(
            isNull(professionalProfiles.anonymous),
            eq(professionalProfiles.anonymous, false),
          ),
        ),
      ),
    )
    .limit(5000);
}
