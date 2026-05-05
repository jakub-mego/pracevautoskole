ALTER TYPE "public"."listing_type" ADD VALUE 'employer_course';--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "course_price_czk" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "course_start_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "course_duration_hours" integer;