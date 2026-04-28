ALTER TABLE "professional_profiles" ADD COLUMN "credentials_object_key" text;--> statement-breakpoint
ALTER TABLE "professional_profiles" ADD COLUMN "credentials_content_type" text;--> statement-breakpoint
ALTER TABLE "professional_profiles" ADD COLUMN "credentials_uploaded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "professional_profiles" ADD COLUMN "credentials_rejection_reason" text;