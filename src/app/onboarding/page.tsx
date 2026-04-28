import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";

export const metadata = {
  title: "Začni s profilem",
};

export default async function OnboardingPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (profile) redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Pojďme dokončit účet
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Kdo jsi na tržišti? Tohle ovlivní, co budeš inzerovat a koho uvidíš.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/onboarding/employer"
          className="block rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-brand-700)]"
        >
          <h2 className="display-xs text-lg text-[var(--color-ink)]">Autoškola</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Hledám instruktory, examinátory, mistry praktického výcviku, lektory.
          </p>
        </Link>

        <Link
          href="/onboarding/professional"
          className="block rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-brand-700)]"
        >
          <h2 className="display-xs text-lg text-[var(--color-ink)]">Profesionál</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Jsem instruktor, examinátor, lektor 48hod. školení, mistr praktického výcviku.
          </p>
        </Link>
      </div>
    </main>
  );
}
