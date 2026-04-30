CREATE TABLE "court_interpreter_profiles" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"test_translation_price_czk" integer,
	"exam_translation_price_czk" integer,
	"languages" text[] DEFAULT '{}' NOT NULL,
	"cities" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "court_interpreter_profiles" ADD CONSTRAINT "court_interpreter_profiles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;