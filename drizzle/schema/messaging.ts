import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { listings } from "./listings";

export const conversations = pgTable(
  "conversations",
  {
    id: text("id").primaryKey(),
    initiatorProfileId: text("initiator_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    recipientProfileId: text("recipient_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    /**
     * Volitelně navázáno na inzerát, kvůli kterému byla konverzace zahájena.
     * Pokud inzerát zmizí, konverzace zůstává — referenci jen vynulujeme.
     */
    listingId: text("listing_id").references(() => listings.id, {
      onDelete: "set null",
    }),
    /**
     * True, jakmile byl odhalen anonymní profesionál (sám napsal jako první =
     * implicitní souhlas s odhalením identity vůči konkrétnímu příjemci).
     */
    anonymityLifted: boolean("anonymity_lifted").notNull().default(false),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("conversation_pair_listing_uq").on(
      t.initiatorProfileId,
      t.recipientProfileId,
      t.listingId,
    ),
    index("conversation_initiator_idx").on(t.initiatorProfileId),
    index("conversation_recipient_idx").on(t.recipientProfileId),
    index("conversation_last_message_idx").on(t.lastMessageAt),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    authorProfileId: text("author_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    /** Čas, kdy příjemce zprávu fakticky viděl v UI. Null = neviděl. */
    readByRecipientAt: timestamp("read_by_recipient_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("messages_conversation_idx").on(t.conversationId),
    index("messages_author_idx").on(t.authorProfileId),
    index("messages_created_idx").on(t.createdAt),
  ],
);
