import { ComingSoonForm } from "@/components/marketing/coming-soon-form";

export const metadata = {
  title: { absolute: "Brzy spouštíme — pracevautoskole.cz" },
  description:
    "Specializovaný pracovní portál pro autoškoly a profesionály oboru v ČR. Brzy spouštíme.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ROLES_TICKER = [
  "Učitel autoškoly",
  "Mistr odborného výcviku",
  "Lektor § 48",
  "Provozní / admin",
  "Zdravotník — první pomoc",
  "Manažer autoškoly",
];

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : "/";

  return (
    <main className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[var(--color-canvas)]">
      <div className="aurora">
        <div className="blob" />
      </div>
      <div className="absolute inset-0 surface-grain pointer-events-none opacity-50" />

      {/* Brand bar */}
      <header className="relative z-10 px-6 py-7 sm:px-12">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-500)] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-brand-700)]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              pracevautoskole.cz
            </span>
          </div>
          <p className="hidden items-center gap-2 text-xs sm:flex">
            <span className="rounded-full bg-[var(--color-paper)]/70 px-3 py-1 font-medium text-[var(--color-ink-muted)] backdrop-blur">
              Beta · jaro 2026
            </span>
          </p>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)]/80 px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-muted)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-700)]" />
            Specializované jen pro obor autoškol
          </p>

          <h1 className="display-xl mt-8 text-[3.25rem] text-[var(--color-ink)] sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            Práce
            <br />
            <em className="not-italic font-display italic font-medium text-[var(--color-brand-800)]">
              v autoškole
            </em>
            <span className="text-[var(--color-brand-700)]">.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)] sm:text-xl">
            Tržiště, kde inzerují obě strany — autoškoly i profesionálové.
            <br className="hidden sm:block" />
            Filtry na kategorie ŘP, profesní způsobilost, dojezd. Spuštění blízko.
          </p>

          {/* Form */}
          <div className="mt-12 w-full max-w-xl">
            <ComingSoonForm from={from} />
            <p className="mt-4 text-xs text-[var(--color-ink-soft)]">
              Nemáš heslo, ale chtěl/a bys vědět, až spustíme? Napiš na{" "}
              <a
                href="mailto:info@onlymego.cz"
                className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
              >
                info@onlymego.cz
              </a>
              .
            </p>
          </div>

          {/* Trust pruh */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-[var(--color-ink-soft)]">
            {[
              "Ověření přes ARES",
              "Ruční verifikace průkazů",
              "Matching dle ŘP a dojezdu",
              "První inzerát zdarma",
            ].map((label) => (
              <span key={label} className="flex items-center gap-1.5">
                <Tick />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10 overflow-hidden border-y border-[var(--color-line-soft)] bg-[var(--color-paper)]/50 py-4 backdrop-blur">
        <div className="marquee-track">
          {[...ROLES_TICKER, ...ROLES_TICKER, ...ROLES_TICKER].map((role, i) => (
            <span
              key={`${role}-${i}`}
              className="flex items-center gap-6 px-6 text-sm font-medium text-[var(--color-ink-muted)]"
            >
              {role}
              <span className="text-[var(--color-brand-600)]">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-xs text-[var(--color-ink-soft)] sm:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2">
          <p>
            Provozuje{" "}
            <span className="font-semibold text-[var(--color-ink-muted)]">
              Autoškola MeGo, s.r.o.
            </span>
            {" · "}IČO 23497297 · Brno
          </p>
          <p>© {new Date().getFullYear()} pracevautoskole.cz</p>
        </div>
      </footer>
    </main>
  );
}

function Tick() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-[var(--color-brand-700)]"
      aria-hidden
    >
      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 6.22a.75.75 0 00-1.06-1.06L7 8.88 5.78 7.66a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l4.25-4.25z" />
    </svg>
  );
}
