CREATE TYPE "public"."review_status" AS ENUM('pending', 'published', 'hidden');--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"reviewer_profile_id" text NOT NULL,
	"reviewee_profile_id" text NOT NULL,
	"rating" integer NOT NULL,
	"body" text NOT NULL,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"moderation_note" text,
	"moderated_by_user_id" text,
	"moderated_at" timestamp with time zone,
	"verified_relationship_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_profile_id_profiles_id_fk" FOREIGN KEY ("reviewer_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewee_profile_id_profiles_id_fk" FOREIGN KEY ("reviewee_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_moderated_by_user_id_users_id_fk" FOREIGN KEY ("moderated_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "review_pair_uq" ON "reviews" USING btree ("reviewer_profile_id","reviewee_profile_id");--> statement-breakpoint
CREATE INDEX "review_reviewee_idx" ON "reviews" USING btree ("reviewee_profile_id");--> statement-breakpoint
CREATE INDEX "review_status_idx" ON "reviews" USING btree ("status");