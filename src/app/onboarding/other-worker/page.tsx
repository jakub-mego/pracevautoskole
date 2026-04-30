import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { OtherWorkerOnboardingForm } from "@/components/forms/other-worker-onboarding-form";

export const metadata = {
  title: "Profil pracovníka autoškoly",
};

export default async function OtherWorkerOnboardingPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (profile) redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Profil pracovníka autoškoly
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Krátké představení — konkrétní roli si pak vybereš v dashboardu.
      </p>

      <div className="mt-8">
        <OtherWorkerOnboardingForm />
      </div>
    </main>
  );
}
