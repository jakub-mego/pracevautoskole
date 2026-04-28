import "server-only";
import { sql, desc, eq, and, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  users,
  listings,
  payments,
  reports,
  profiles,
  professionalProfiles,
} from "../../../drizzle/schema";

export async function getAdminStats() {
  const [usersCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);
  const [listingsActive] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .where(eq(listings.status, "active"));
  const [reportsOpen] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reports)
    .where(eq(reports.status, "open"));
  const [paymentsPaid] = await db
    .select({
      count: sql<number>`count(*)::int`,
      sum: sql<number>`coalesce(sum(amount_czk),0)::int`,
    })
    .from(payments)
    .where(eq(payments.status, "paid"));
  const [unverified] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.emailVerified, false));
  const [pendingCredentials] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(professionalProfiles)
    .where(eq(professionalProfiles.credentialsVerification, "pending"));

  return {
    users: usersCount?.count ?? 0,
    unverified: unverified?.count ?? 0,
    listingsActive: listingsActive?.count ?? 0,
    reportsOpen: reportsOpen?.count ?? 0,
    paymentsPaid: paymentsPaid?.count ?? 0,
    revenueCzk: paymentsPaid?.sum ?? 0,
    pendingCredentials: pendingCredentials?.count ?? 0,
  };
}

export async function listAdminUsers(limit = 100) {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

export async function listAdminListings(limit = 100) {
  return db
    .select({
      listing: listings,
      profile: profiles,
    })
    .from(listings)
    .innerJoin(profiles, eq(profiles.id, listings.profileId))
    .orderBy(desc(listings.updatedAt))
    .limit(limit);
}

export async function listOpenReports(limit = 100) {
  return db
    .select({
      report: reports,
      reporterEmail: users.email,
    })
    .from(reports)
    .leftJoin(users, eq(users.id, reports.reporterUserId))
    .where(eq(reports.status, "open"))
    .orderBy(desc(reports.createdAt))
    .limit(limit);
}

export async function listAllReports(limit = 200) {
  return db
    .select({
      report: reports,
      reporterEmail: users.email,
    })
    .from(reports)
    .leftJoin(users, eq(users.id, reports.reporterUserId))
    .orderBy(desc(reports.createdAt))
    .limit(limit);
}

export async function listAdminPayments(limit = 200) {
  return db
    .select({
      payment: payments,
      userEmail: users.email,
    })
    .from(payments)
    .leftJoin(users, eq(users.id, payments.userId))
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

export async function countPendingVerifications() {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(professionalProfiles)
    .where(eq(professionalProfiles.credentialsVerification, "pending"));
  return row?.count ?? 0;
}

export async function listPendingVerifications(limit = 100) {
  return db
    .select({
      profile: profiles,
      verification: professionalProfiles.credentialsVerification,
      objectKey: professionalProfiles.credentialsObjectKey,
      contentType: professionalProfiles.credentialsContentType,
      uploadedAt: professionalProfiles.credentialsUploadedAt,
      reviewedAt: professionalProfiles.credentialsReviewedAt,
      rejectionReason: professionalProfiles.credentialsRejectionReason,
      userEmail: users.email,
    })
    .from(professionalProfiles)
    .innerJoin(profiles, eq(profiles.id, professionalProfiles.profileId))
    .leftJoin(users, eq(users.id, profiles.userId))
    .where(eq(professionalProfiles.credentialsVerification, "pending"))
    .orderBy(desc(professionalProfiles.credentialsUploadedAt))
    .limit(limit);
}

export async function listOrphanedPayments(limit = 100) {
  // Platby anonymizovaných (smazaných) účtů — pro účetní zákon zůstávají.
  return db
    .select()
    .from(payments)
    .where(and(isNull(payments.userId), eq(payments.status, "paid")))
    .orderBy(desc(payments.paidAt))
    .limit(limit);
}
