ALTER TABLE "professional_roles" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "listing_roles" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DELETE FROM "professional_roles" WHERE "role" = 'master_practice';--> statement-breakpoint
DELETE FROM "listing_roles" WHERE "role" = 'master_practice';--> statement-breakpoint
DROP TYPE "public"."professional_role";--> statement-breakpoint
CREATE TYPE "public"."professional_role" AS ENUM('instructor', 'examiner', 'operator_admin', 'lecturer_48', 'manager', 'medic', 'court_interpreter', 'other');--> statement-breakpoint
ALTER TABLE "professional_roles" ALTER COLUMN "role" SET DATA TYPE "public"."professional_role" USING "role"::"public"."professional_role";--> statement-breakpoint
ALTER TABLE "listing_roles" ALTER COLUMN "role" SET DATA TYPE "public"."professional_role" USING "role"::"public"."professional_role";--> statement-breakpoint
ALTER TABLE "professional_profiles" ADD COLUMN "custom_role_label" text;