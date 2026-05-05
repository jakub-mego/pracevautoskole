import Link from "next/link";
import { listActiveCourses } from "@/lib/listings/queries";
import { AresVerifiedBadge } from "@/components/listings/ares-verified-badge";

export const metadata = {
  title: "Kurzy pro budoucí učitele autoškoly",
  description:
    "Aktuální nabídka kurzů pro získání profesního osvědčení učitele autoškoly. Termíny, ceny a kontakty na akreditované autoškoly napříč ČR.",
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function fmtCzk(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("cs-CZ").format(n) + " Kč";
}

function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function KurzyProUciteleHub() {
  const rows = await listActiveCourses(50);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
        Pro budoucí učitele
      </p>
      <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl md:text-5xl">
        Kurzy pro budoucí učitele autoškoly
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--color-ink-muted)]">
        Aktuální nabídka kurzů od akreditovaných autoškol pro získání
        profesního osvědčení učitele autoškoly. Pro vstup do profese
        musíš podle zákona č. 247/2000 Sb. absolvovat odbornou přípravu
        a složit zkoušku odborné způsobilosti před komisí krajského
        úřadu. Tyto autoškoly nabízejí přípravu krok za krokem.
      </p>

      <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
        Detail profese, kvalifikační požadavky a orientační odměnu najdeš
        na stránce <Link href="/ucitel-autoskoly" className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline">učitel autoškoly</Link>.
      </p>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="display-xs text-xl text-[var(--color-ink)]">
            Aktuální kurzy ({rows.length})
          </h2>
          <Link
            href="/listings/new?type=course"
            className="text-sm font-medium text-[var(--color-brand-700)] hover:underline"
          >
            Inzerovat kurz →
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-10 text-center">
            <p className="display-xs text-xl text-[var(--color-ink)]">
              Zatím žádné aktivní kurzy
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Pokud jsi autoškola s akreditací, můžeš svůj kurz inzerovat
              jako první.{" "}
              <Link
                href="/listings/new?type=course"
                className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
              >
                Vytvořit inzerát kurzu
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-4">
            {rows.map(({ listing, profile, aresVerifiedAt }) => {
              const cityRegion = [listing.city, listing.region].filter(Boolean).join(" · ");
              return (
                <li
                  key={listing.id}
                  className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-brand-700)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                        Kurz pro učitele autoškoly
                      </span>
                      <Link href={`/inzeraty/${listing.id}`}>
                        <h3 className="display-xs mt-1.5 text-lg text-[var(--color-ink)] sm:text-xl">
                          {listing.title}
                        </h3>
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--color-ink-soft)]">Cena</p>
                      <p className="text-base font-semibold text-[var(--color-ink)] tabular-nums">
                        {fmtCzk(listing.coursePriceCzk)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-ink-muted)]">
                    <Link
                      href={`/p/${profile.slug}`}
                      className="font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-700)] hover:underline"
                    >
                      {profile.displayName}
                    </Link>
                    {aresVerifiedAt ? <AresVerifiedBadge /> : null}
                    {cityRegion ? (
                      <span className="text-[var(--color-ink-soft)]">· {cityRegion}</span>
                    ) : null}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-ink-muted)]">
                    {listing.courseStartDate ? (
                      <span>
                        <strong className="text-[var(--color-ink)]">Start:</strong>{" "}
                        {fmtDate(listing.courseStartDate)}
                      </span>
                    ) : null}
                    {listing.courseDurationHours ? (
                      <span>
                        <strong className="text-[var(--color-ink)]">Délka:</strong>{" "}
                        {listing.courseDurationHours} h
                      </span>
                    ) : null}
                  </div>

                  <Link
                    href={`/inzeraty/${listing.id}`}
                    className="mt-4 inline-block text-sm font-semibold text-[var(--color-brand-700)] hover:underline"
                  >
                    Detail kurzu →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">
          Jste autoškola s akreditací? Inzerujte svůj kurz
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Zveřejnění kurzu pro učitele autoškoly stojí jednorázově{" "}
          <strong>999 Kč</strong>. Inzerát je 90 dní aktivní v této sekci
          i ve vyhledávání. Ideální místo, kde najdete budoucí studenty
          se serióznímu zájmem o kvalifikaci.
        </p>
        <Link
          href="/listings/new?type=course"
          className="mt-4 inline-block rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-900)]"
        >
          Inzerovat kurz
        </Link>
      </section>
    </main>
  );
}
