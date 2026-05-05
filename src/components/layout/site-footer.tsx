import Link from "next/link";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@onlymego.cz";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[var(--color-line-soft)] bg-[var(--color-paper)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-brand-600)]" />
            <span className="text-sm font-semibold tracking-tight text-[var(--color-ink)]">
              pracevautoskole.cz
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Specializované tržiště práce pro obor autoškol v ČR. Pro učitele,
            lektory § 48, soudní tlumočníky i provoz.
          </p>
          <p className="mt-6 text-xs text-[var(--color-ink-soft)]">
            Provozuje{" "}
            <span className="font-medium text-[var(--color-ink-muted)]">
              Autoškola MeGo, s.r.o.
            </span>{" "}
            · IČO 23497297 · Brno
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Pro autoškoly
          </p>
          <Link
            href="/sign-up"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Vytvořit účet
          </Link>
          <Link
            href="/listings/new"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Inzerovat pozici
          </Link>
          <Link
            href="/listings/new?type=course"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Inzerovat kurz
          </Link>
        </nav>

        <nav className="flex flex-col gap-2 text-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Pro profesionály
          </p>
          <Link
            href="/ucitel-autoskoly"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Učitel autoškoly
          </Link>
          <Link
            href="/lektor-skoleni-ridicu"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Lektor § 48
          </Link>
          <Link
            href="/soudni-tlumocnik-autoskola"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Soudní tlumočník
          </Link>
          <Link
            href="/kurzy-pro-ucitele"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Kurzy pro učitele
          </Link>
        </nav>

        <nav className="flex flex-col gap-2 text-sm sm:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Tržiště
          </p>
          <Link
            href="/inzeraty"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Inzeráty
          </Link>
          <Link
            href="/profese"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Profese a města
          </Link>
          <Link
            href="/blog"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Blog
          </Link>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Pravidla
          </p>
          <Link
            href="/podminky-pouzivani"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Podmínky používání
          </Link>
          <Link
            href="/zasady-ochrany-osobnich-udaju"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Ochrana údajů
          </Link>
          <Link
            href="/cookies"
            className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-brand-700)]"
          >
            Cookies
          </Link>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            Kontakt
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[var(--color-brand-700)] underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </nav>
      </div>

      <div className="border-t border-[var(--color-line-soft)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-xs text-[var(--color-ink-soft)]">
          <p>© {year} pracevautoskole.cz</p>
          <p>Made in Brno · ČR</p>
        </div>
      </div>
    </footer>
  );
}
