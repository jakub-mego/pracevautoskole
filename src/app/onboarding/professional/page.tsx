import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { ProfessionalOnboardingForm } from "@/components/forms/professional-onboarding-form";

export const metadata = {
  title: "Profil profesionála",
};

export default async function ProfessionalOnboardingPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (profile) redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Profil profesionála
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Pár základních údajů — později doplníš zkušenosti, sazby a inzerát.
      </p>

      <div className="mt-8">
        <ProfessionalOnboardingForm />
      </div>
    </main>
  );
}
