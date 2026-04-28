CREATE TYPE "public"."license_category" AS ENUM('AM', 'A1', 'A2', 'A', 'B1', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'T');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('draft', 'pending_payment', 'active', 'paused', 'expired', 'archived');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('employer_seeks', 'professional_seeks');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'fio');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."product_kind" AS ENUM('listing_publish', 'listing_boost', 'active_badge', 'database_access');--> statement-breakpoint
CREATE TYPE "public"."professional_role" AS ENUM('instructor', 'examiner', 'master_practice', 'operator_admin', 'lecturer_48', 'manager', 'medic');--> statement-breakpoint
CREATE TYPE "public"."profile_type" AS ENUM('employer', 'professional');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('unverified', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text,
	"image" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employer_profiles" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"ico" text NOT NULL,
	"legal_name" text NOT NULL,
	"website" text,
	"phone" text,
	"public_email" text,
	"ares_verified_at" timestamp with time zone,
	"ares_snapshot" jsonb,
	"is_autoskola" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employer_profiles_ico_unique" UNIQUE("ico")
);
--> statement-breakpoint
CREATE TABLE "professional_licenses" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"category" "license_category" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_profiles" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"anonymous" boolean DEFAULT false NOT NULL,
	"phone" text,
	"public_email" text,
	"credentials_verification" "verification_status" DEFAULT 'unverified' NOT NULL,
	"credentials_reviewed_at" timestamp with time zone,
	"credentials_reviewer_id" text,
	"actively_seeking" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"role" "professional_role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "profile_type" NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"about" text,
	"avatar_url" text,
	"region" text,
	"city" text,
	"postal_code" text,
	"latitude" integer,
	"longitude" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "listing_licenses" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"category" "license_category" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"role" "professional_role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"type" "listing_type" NOT NULL,
	"status" "listing_status" DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"region" text,
	"city" text,
	"postal_code" text,
	"remote_friendly" integer DEFAULT 0 NOT NULL,
	"travel_radius_km" integer,
	"rate_theory_min" integer,
	"rate_theory_max" integer,
	"rate_practice_min" integer,
	"rate_practice_max" integer,
	"rate_health_min" integer,
	"rate_health_max" integer,
	"employment_type" text,
	"start_availability" text,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"boosted_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"counterpart_profile_id" text NOT NULL,
	"score" integer NOT NULL,
	"reasons" jsonb NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"listing_id" text,
	"product" "product_kind" NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"amount_czk" integer NOT NULL,
	"variable_symbol" text,
	"external_id" text,
	"metadata" jsonb,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_variable_symbol_unique" UNIQUE("variable_symbol")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_licenses" ADD CONSTRAINT "professional_licenses_profile_id_professional_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."professional_profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_profiles" ADD CONSTRAINT "professional_profiles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_profiles" ADD CONSTRAINT "professional_profiles_credentials_reviewer_id_users_id_fk" FOREIGN KEY ("credentials_reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_roles" ADD CONSTRAINT "professional_roles_profile_id_professional_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."professional_profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_licenses" ADD CONSTRAINT "listing_licenses_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_roles" ADD CONSTRAINT "listing_roles_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_counterpart_profile_id_profiles_id_fk" FOREIGN KEY ("counterpart_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "employer_ico_idx" ON "employer_profiles" USING btree ("ico");--> statement-breakpoint
CREATE UNIQUE INDEX "professional_license_uq" ON "professional_licenses" USING btree ("profile_id","category");--> statement-breakpoint
CREATE UNIQUE INDEX "professional_role_uq" ON "professional_roles" USING btree ("profile_id","role");--> statement-breakpoint
CREATE INDEX "profiles_user_idx" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profiles_type_idx" ON "profiles" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "listing_license_uq" ON "listing_licenses" USING btree ("listing_id","category");--> statement-breakpoint
CREATE UNIQUE INDEX "listing_role_uq" ON "listing_roles" USING btree ("listing_id","role");--> statement-breakpoint
CREATE INDEX "listings_profile_idx" ON "listings" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "listings_type_status_idx" ON "listings" USING btree ("type","status");--> statement-breakpoint
CREATE INDEX "listings_published_idx" ON "listings" USING btree ("published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "match_uq" ON "matches" USING btree ("listing_id","counterpart_profile_id");--> statement-breakpoint
CREATE INDEX "match_score_idx" ON "matches" USING btree ("score");--> statement-breakpoint
CREATE INDEX "payments_user_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_listing_idx" ON "payments" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");