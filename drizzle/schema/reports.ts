import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import {
  reportTargetEnum,
  reportReasonEnum,
  reportStatusEnum,
} from "./enums";

export const reports = pgTable(
  "reports",
  {
    id: text("id").primaryKey(),
    reporterUserId: text("reporter_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    targetType: reportTargetEnum("target_type").notNull(),
    targetId: text("target_id").notNull(),
    reason: reportReasonEnum("reason").notNull(),
    note: text("note"),
    status: reportStatusEnum("status").notNull().default("open"),
    resolvedByUserId: text("resolved_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    resolverNote: text("resolver_note"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("reports_status_idx").on(t.status),
    index("reports_target_idx").on(t.targetType, t.targetId),
    index("reports_created_idx").on(t.createdAt),
  ],
);
