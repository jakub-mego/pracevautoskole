import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { ListingForm } from "@/components/forms/listing-form";

export const metadata = {
  title: "Nový inzerát",
};

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");
  const sp = await searchParams;

  const wantsCourse = sp.type === "course";
  if (wantsCourse && profile.type !== "employer") {
    redirect("/listings/new");
  }

  // Pokud autoškola nezvolila typ, ukážeme rozcestník
  if (profile.type === "employer" && !sp.type) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
          Co chceš inzerovat?
        </h1>
        <p className="mt-2 text-[var(--color-ink-muted)]">
          Pracovní nabídku do týmu, nebo kurz pro budoucí učitele autoškoly?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/listings/new?type=job"
            className="block rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-brand-700)]"
          >
            <h2 className="display-xs text-lg text-[var(--color-ink)]">
              Hledáme do týmu
            </h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Pracovní inzerát — učitel, lektor § 48, examinátor… První 3
              inzeráty zdarma, pak 790 Kč.
            </p>
          </Link>
          <Link
            href="/listings/new?type=course"
            className="block rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-brand-700)]"
          >
            <h2 className="display-xs text-lg text-[var(--color-ink)]">
              Kurz pro učitele
            </h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Inzerát s nabídkou kurzu pro budoucí učitele autoškoly.
              Jednorázový poplatek <strong>999 Kč</strong> za zveřejnění.
            </p>
          </Link>
        </div>
      </main>
    );
  }

  const intent: "employer_seeks" | "professional_seeks" | "employer_course" =
    wantsCourse
      ? "employer_course"
      : profile.type === "employer"
        ? "employer_seeks"
        : "professional_seeks";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Nový inzerát
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Uložíme jako koncept. Než zveřejníš, můžeš si ho ještě upravit.
      </p>

      <div className="mt-8 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <ListingForm mode="create" intent={intent} />
      </div>
    </main>
  );
}
