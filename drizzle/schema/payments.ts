import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { listings } from "./listings";
import { paymentProviderEnum, paymentStatusEnum, productKindEnum } from "./enums";

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    listingId: text("listing_id").references(() => listings.id, { onDelete: "set null" }),
    product: productKindEnum("product").notNull(),
    provider: paymentProviderEnum("provider").notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    amountCzk: integer("amount_czk").notNull(),
    variableSymbol: text("variable_symbol").unique(),
    externalId: text("external_id"),
    metadata: jsonb("metadata"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("payments_user_idx").on(t.userId),
    index("payments_listing_idx").on(t.listingId),
    index("payments_status_idx").on(t.status),
  ],
);
