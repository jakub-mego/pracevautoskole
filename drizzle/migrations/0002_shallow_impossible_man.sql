CREATE TYPE "public"."report_reason" AS ENUM('spam', 'inappropriate', 'discrimination', 'duplicate', 'out_of_scope', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."report_target" AS ENUM('listing', 'profile');--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"reporter_user_id" text,
	"target_type" "report_target" NOT NULL,
	"target_id" text NOT NULL,
	"reason" "report_reason" NOT NULL,
	"note" text,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"resolved_by_user_id" text,
	"resolver_note" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "receipt_number" text;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_user_id_users_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reports_target_idx" ON "reports" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "reports_created_idx" ON "reports" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_receipt_number_unique" UNIQUE("receipt_number");