CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"initiator_profile_id" text NOT NULL,
	"recipient_profile_id" text NOT NULL,
	"listing_id" text,
	"anonymity_lifted" boolean DEFAULT false NOT NULL,
	"last_message_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"author_profile_id" text NOT NULL,
	"body" text NOT NULL,
	"read_by_recipient_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_initiator_profile_id_profiles_id_fk" FOREIGN KEY ("initiator_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_recipient_profile_id_profiles_id_fk" FOREIGN KEY ("recipient_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_author_profile_id_profiles_id_fk" FOREIGN KEY ("author_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_pair_listing_uq" ON "conversations" USING btree ("initiator_profile_id","recipient_profile_id","listing_id");--> statement-breakpoint
CREATE INDEX "conversation_initiator_idx" ON "conversations" USING btree ("initiator_profile_id");--> statement-breakpoint
CREATE INDEX "conversation_recipient_idx" ON "conversations" USING btree ("recipient_profile_id");--> statement-breakpoint
CREATE INDEX "conversation_last_message_idx" ON "conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_author_idx" ON "messages" USING btree ("author_profile_id");--> statement-breakpoint
CREATE INDEX "messages_created_idx" ON "messages" USING btree ("created_at");