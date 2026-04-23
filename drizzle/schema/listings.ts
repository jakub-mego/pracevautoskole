import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import {
  listingTypeEnum,
  listingStatusEnum,
  licenseCategoryEnum,
  professionalRoleEnum,
} from "./enums";

export const listings = pgTable(
  "listings",
  {
    id: text("id").primaryKey(),
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    type: listingTypeEnum("type").notNull(),
    status: listingStatusEnum("status").notNull().default("draft"),
    title: text("title").notNull(),
    description: text("description").notNull(),

    region: text("region"),
    city: text("city"),
    postalCode: text("postal_code"),
    remoteFriendly: integer("remote_friendly").notNull().default(0),
    travelRadiusKm: integer("travel_radius_km"),

    // Sazby za 45 min v Kč (min/max). Theory/practice/health
    rateTheoryMin: integer("rate_theory_min"),
    rateTheoryMax: integer("rate_theory_max"),
    ratePracticeMin: integer("rate_practice_min"),
    ratePracticeMax: integer("rate_practice_max"),
    rateHealthMin: integer("rate_health_min"),
    rateHealthMax: integer("rate_health_max"),

    employmentType: text("employment_type"),
    startAvailability: text("start_availability"),

    publishedAt: timestamp("published_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    boostedUntil: timestamp("boosted_until", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("listings_profile_idx").on(t.profileId),
    index("listings_type_status_idx").on(t.type, t.status),
    index("listings_published_idx").on(t.publishedAt),
  ],
);

export const listingRoles = pgTable(
  "listing_roles",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
    role: professionalRoleEnum("role").notNull(),
  },
  (t) => [uniqueIndex("listing_role_uq").on(t.listingId, t.role)],
);

export const listingLicenses = pgTable(
  "listing_licenses",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
    category: licenseCategoryEnum("category").notNull(),
  },
  (t) => [uniqueIndex("listing_license_uq").on(t.listingId, t.category)],
);

export const matches = pgTable(
  "matches",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
    counterpartProfileId: text("counterpart_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    reasons: jsonb("reasons").notNull(),
    computedAt: timestamp("computed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("match_uq").on(t.listingId, t.counterpartProfileId),
    index("match_score_idx").on(t.score),
  ],
);
