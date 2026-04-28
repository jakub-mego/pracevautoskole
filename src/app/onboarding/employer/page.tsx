import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { EmployerOnboardingForm } from "@/components/forms/employer-onboarding-form";

export const metadata = {
  title: "Profil autoškoly",
};

export default async function EmployerOnboardingPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (profile) redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Profil autoškoly
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Načteme tě z ARESu podle IČO. Pak doladíš zobrazované jméno.
      </p>

      <div className="mt-8">
        <EmployerOnboardingForm />
      </div>
    </main>
  );
}
