import {
  pgTable,
  text,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { users } from "./users";
import { reviewStatusEnum } from "./enums";

/**
 * Recenze. Per project memory (2026-04-21):
 *   - Jen jednosměrně: profesionál → autoškola.
 *   - Aktivace UI až v pozdější fázi; teď je to jen datový model.
 *   - Vyžaduje ověření pracovního poměru — `verifiedRelationshipAt`
 *     se nastaví adminem (manuálně, neexistují automaty).
 *
 * `revieweeProfileId` musí být typu employer (kontroluje server action,
 * až bude existovat). Schéma to neumí vynutit, ale unique index
 * `(reviewer, reviewee)` zajistí jednu recenzi na pár.
 */
export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    reviewerProfileId: text("reviewer_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    revieweeProfileId: text("reviewee_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    status: reviewStatusEnum("status").notNull().default("pending"),
    moderationNote: text("moderation_note"),
    moderatedByUserId: text("moderated_by_user_id").references(() => users.id),
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
    /**
     * Čas, kdy admin manuálně ověřil pracovní vztah mezi reviewerem
     * a revieweem (např. ze zaslaných dokladů). Bez tohoto se recenze
     * nepublikuje.
     */
    verifiedRelationshipAt: timestamp("verified_relationship_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("review_pair_uq").on(t.reviewerProfileId, t.revieweeProfileId),
    index("review_reviewee_idx").on(t.revieweeProfileId),
    index("review_status_idx").on(t.status),
  ],
);
