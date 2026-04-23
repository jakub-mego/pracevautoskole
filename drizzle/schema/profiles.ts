import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import {
  profileTypeEnum,
  professionalRoleEnum,
  licenseCategoryEnum,
  verificationStatusEnum,
} from "./enums";

export const profiles = pgTable(
  "profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: profileTypeEnum("type").notNull(),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    about: text("about"),
    avatarUrl: text("avatar_url"),
    region: text("region"),
    city: text("city"),
    postalCode: text("postal_code"),
    latitude: integer("latitude"),
    longitude: integer("longitude"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("profiles_user_idx").on(t.userId),
    index("profiles_type_idx").on(t.type),
  ],
);

export const employerProfiles = pgTable(
  "employer_profiles",
  {
    profileId: text("profile_id")
      .primaryKey()
      .references(() => profiles.id, { onDelete: "cascade" }),
    ico: text("ico").notNull().unique(),
    legalName: text("legal_name").notNull(),
    website: text("website"),
    phone: text("phone"),
    publicEmail: text("public_email"),
    aresVerifiedAt: timestamp("ares_verified_at", { withTimezone: true }),
    aresSnapshot: jsonb("ares_snapshot"),
    isAutoskola: boolean("is_autoskola").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("employer_ico_idx").on(t.ico)],
);

export const professionalProfiles = pgTable("professional_profiles", {
  profileId: text("profile_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  anonymous: boolean("anonymous").notNull().default(false),
  phone: text("phone"),
  publicEmail: text("public_email"),
  credentialsVerification: verificationStatusEnum("credentials_verification")
    .notNull()
    .default("unverified"),
  credentialsReviewedAt: timestamp("credentials_reviewed_at", { withTimezone: true }),
  credentialsReviewerId: text("credentials_reviewer_id").references(() => users.id),
  activelySeeking: boolean("actively_seeking").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const professionalRoles = pgTable(
  "professional_roles",
  {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
      .notNull()
      .references(() => professionalProfiles.profileId, { onDelete: "cascade" }),
    role: professionalRoleEnum("role").notNull(),
  },
  (t) => [uniqueIndex("professional_role_uq").on(t.profileId, t.role)],
);

export const professionalLicenses = pgTable(
  "professional_licenses",
  {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
      .notNull()
      .references(() => professionalProfiles.profileId, { onDelete: "cascade" }),
    category: licenseCategoryEnum("category").notNull(),
  },
  (t) => [uniqueIndex("professional_license_uq").on(t.profileId, t.category)],
);
