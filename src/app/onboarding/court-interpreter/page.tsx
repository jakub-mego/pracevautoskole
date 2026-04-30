import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { CourtInterpreterOnboardingForm } from "@/components/forms/court-interpreter-onboarding-form";

export const metadata = {
  title: "Profil soudního tlumočníka",
};

export default async function CourtInterpreterOnboardingPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (profile) redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Profil soudního tlumočníka
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Krátké představení a parametry, podle kterých si tě autoškoly najdou.
      </p>

      <div className="mt-8">
        <CourtInterpreterOnboardingForm />
      </div>
    </main>
  );
}
