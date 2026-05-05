ALTER TABLE "listings" ADD COLUMN "rate_practice_own_car_min" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "rate_practice_own_car_max" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "has_own_vehicle" integer DEFAULT 0 NOT NULL;