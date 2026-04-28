"use server";

import { z } from "zod";
import { and, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/server";
import { newId } from "@/lib/utils/id";
import { listings, profiles, reports } from "../../../drizzle/schema";

const ReportSchema = z.object({
  targetType: z.enum(["listing", "profile"]),
  targetId: z.string().min(1).max(120),
  reason: z.enum([
    "spam",
    "inappropriate",
    "discrimination",
    "duplicate",
    "out_of_scope",
    "other",
  ]),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ReportActionState =
  | { ok: true }
  | { error: string }
  | undefined;

export async function createReportAction(input: {
  targetType: "listing" | "profile";
  targetId: string;
  reason: string;
  note?: string;
}): Promise<ReportActionState> {
  const session = await requireSession();

  const parsed = ReportSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data." };
  }
  const data = parsed.data;

  // Cíl musí existovat — preventujeme mass-spam reportů.
  if (data.targetType === "listing") {
    const exists = await db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.id, data.targetId))
      .limit(1);
    if (!exists[0]) return { error: "Inzerát neexistuje." };
  } else {
    const exists = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, data.targetId))
      .limit(1);
    if (!exists[0]) return { error: "Profil neexistuje." };
  }

  // Rate limit: max 5 reportů za hodinu od jednoho usera.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db
    .select({ id: reports.id })
    .from(reports)
    .where(
      and(
        eq(reports.reporterUserId, session.user.id),
        gte(reports.createdAt, oneHourAgo),
      ),
    )
    .limit(6);
  if (recent.length >= 5) {
    return {
      error: "Příliš mnoho reportů v krátkém čase. Zkus to za chvíli.",
    };
  }

  // Deduplikace: stejný reporter + stejný cíl, otevřený report → neukládat duplikát.
  const dup = await db
    .select({ id: reports.id })
    .from(reports)
    .where(
      and(
        eq(reports.reporterUserId, session.user.id),
        eq(reports.targetType, data.targetType),
        eq(reports.targetId, data.targetId),
        eq(reports.status, "open"),
      ),
    )
    .limit(1);
  if (dup[0]) return { ok: true };

  await db.insert(reports).values({
    id: newId(),
    reporterUserId: session.user.id,
    targetType: data.targetType,
    targetId: data.targetId,
    reason: data.reason,
    note: data.note || null,
  });

  return { ok: true };
}
