import Link from "next/link";
import { SEO_CITIES, SEO_ROLES } from "@/lib/seo/landing-data";

export const metadata = {
  title: "Práce v autoškole — kraj, město, role",
  description:
    "Aktuální nabídky práce v autoškolách napříč ČR. Vyber si podle role (učitel, mistr výcviku, lektor § 48) nebo města.",
};

export default function LandingHubPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="display-md text-3xl text-[var(--color-ink)] sm:text-4xl">
        Práce v autoškole
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
        Specializovaný portál pro obor autoškol v ČR. Najdi inzerát podle své
        role nebo města — autoškoly i profesionálové oboru tu zveřejňují svoje
        poptávky a nabídky.
      </p>

      <section className="mt-10">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">Podle role</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SEO_ROLES.map((r) => (
            <li
              key={r.slug}
              className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
            >
              <Link
                href={`/prace-v-autoskole/${r.slug}`}
                className="text-base font-semibold text-[var(--color-ink)] hover:underline"
              >
                {r.name}
              </Link>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)] line-clamp-3">{r.intro}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">Podle města</h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {SEO_CITIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/prace-v-autoskole/${c.slug}`}
                className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:underline"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
