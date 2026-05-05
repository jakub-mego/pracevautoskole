import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
]);

export const profileTypeEnum = pgEnum("profile_type", [
  "employer",
  "professional",
]);

export const professionalRoleEnum = pgEnum("professional_role", [
  "instructor",
  "examiner",
  "operator_admin",
  "lecturer_48",
  "manager",
  "medic",
  "court_interpreter",
  "other",
]);

export const licenseCategoryEnum = pgEnum("license_category", [
  "AM", "A1", "A2", "A",
  "B1", "B", "BE",
  "C1", "C1E", "C", "CE",
  "D1", "D1E", "D", "DE",
  "T",
]);

export const listingTypeEnum = pgEnum("listing_type", [
  "employer_seeks",
  "professional_seeks",
  "employer_course",
]);

export const listingStatusEnum = pgEnum("listing_status", [
  "draft",
  "pending_payment",
  "active",
  "paused",
  "expired",
  "archived",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "unverified",
  "pending",
  "verified",
  "rejected",
]);

export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "fio",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const productKindEnum = pgEnum("product_kind", [
  "listing_publish",
  "listing_boost",
  "active_badge",
  "database_access",
]);

export const reportTargetEnum = pgEnum("report_target", [
  "listing",
  "profile",
]);

export const reportReasonEnum = pgEnum("report_reason", [
  "spam",
  "inappropriate",
  "discrimination",
  "duplicate",
  "out_of_scope",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "resolved",
  "dismissed",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "published",
  "hidden",
]);
