import Link from "next/link";
import { getSession } from "@/lib/auth/server";
import { ButtonLink, ArrowRight } from "@/components/ui/button";
import { Eyebrow, Pill } from "@/components/ui/eyebrow";

const ROLES_TICKER = [
  "Učitel autoškoly",
  "Lektor § 48",
  "Soudní tlumočník",
  "Provozní / admin",
  "Zdravotník",
  "Manažer autoškoly",
];

const TOP_CITIES = [
  { name: "Praha", slug: "praha" },
  { name: "Brno", slug: "brno" },
  { name: "Ostrava", slug: "ostrava" },
  { name: "Plzeň", slug: "plzen" },
  { name: "Liberec", slug: "liberec" },
  { name: "Olomouc", slug: "olomouc" },
  { name: "České Budějovice", slug: "ceske-budejovice" },
  { name: "Hradec Králové", slug: "hradec-kralove" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const session = await getSession();
  const sp = await searchParams;

  return (
    <>
      {sp.deleted === "1" ? (
        <div className="mx-auto w-full max-w-6xl px-6 pt-6">
          <p className="rounded-lg border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3 text-sm text-[var(--color-brand-800)]">
            Účet byl smazán. Děkujeme za používání služby.
          </p>
        </div>
      ) : null}

      {/* HERO ==================================================== */}
      <section className="relative overflow-hidden">
        <div className="aurora">
          <div className="blob" />
        </div>
        <div className="absolute inset-0 surface-grain pointer-events-none opacity-50" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 text-center sm:py-28 lg:py-36">
          <Pill variant="outline" className="bg-[var(--color-paper)]/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-700)]" />
            Specializované jen pro obor autoškol · ČR
          </Pill>

          <h1 className="display-xl mx-auto mt-8 max-w-4xl text-5xl text-[var(--color-ink)] sm:text-7xl md:text-[5.5rem] lg:text-[7rem]">
            Tržiště, které{" "}
            <em className="font-display italic font-medium text-[var(--color-brand-800)]">
              rozumí oboru
            </em>
            .
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)] sm:text-xl">
            Autoškola dá inzerát „hledáme do týmu“. Profesionál dá inzerát
            „hledám místo“. Matching dle kategorií ŘP a dojezdu. Žádný
            generický job board.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {session ? (
              <ButtonLink href="/dashboard" size="lg" className="group shadow-[var(--shadow-elevated)]">
                Pokračovat do přehledu <ArrowRight />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/sign-up" size="lg" className="group shadow-[var(--shadow-elevated)]">
                  Vytvořit účet zdarma <ArrowRight />
                </ButtonLink>
                <ButtonLink href="/inzeraty" variant="secondary" size="lg" className="bg-[var(--color-paper)]/80 backdrop-blur">
                  Procházet inzeráty
                </ButtonLink>
              </>
            )}
          </div>

        </div>
      </section>

      {/* MARQUEE =================================================== */}
      <section className="relative overflow-hidden border-y border-[var(--color-line-soft)] bg-[var(--color-paper)]/40 py-5 backdrop-blur">
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
      </section>

      {/* BENTO ===================================================== */}
      <section className="relative bg-[var(--color-canvas)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Proč specializované tržiště</Eyebrow>
            <h2 className="display-md mt-3 text-4xl text-[var(--color-ink)] sm:text-5xl md:text-6xl">
              Generický job board nestačí.
              <br />
              <em className="font-display italic font-medium text-[var(--color-brand-800)]">
                Tady to chápeme.
              </em>
            </h2>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-6 sm:grid-rows-2 lg:gap-5">
            <article className="sm:col-span-3 sm:row-span-2 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[var(--color-brand-100)] opacity-60 blur-2xl" />
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-800)]">
                  <DotPair />
                </span>
                <h3 className="display-xs mt-5 text-xl text-[var(--color-ink)] sm:text-2xl">
                  Symetrické tržiště
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  Obě strany aktivně inzerují. Autoškola hledá učitele i naopak.
                  Matching engine navrhne protistrany dle profilu.
                </p>
              </div>
              <div className="relative mt-8 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-3">
                  <p className="font-semibold text-[var(--color-ink-muted)]">Autoškola</p>
                  <p className="mt-1 text-[var(--color-ink-soft)]">
                    Hledáme do týmu — definuj role, kategorie ŘP a lokalitu.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-3">
                  <p className="font-semibold text-[var(--color-ink-muted)]">Profesionál</p>
                  <p className="mt-1 text-[var(--color-ink-soft)]">
                    Hledám místo — co umíš, kam dojedeš, za jakou sazbu.
                  </p>
                </div>
              </div>
            </article>

            <article className="sm:col-span-3 relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-800)]">
                <Steering />
              </span>
              <h3 className="display-xs text-xl text-[var(--color-ink)] sm:text-2xl">
                Filtry na kategorie ŘP
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                Filtruj přesně podle skupin, které učíš nebo na které sháníš lektora.
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {["AM", "A", "B", "BE", "C", "CE", "D", "DE", "T"].map((c) => (
                  <Link
                    key={c}
                    href={`/inzeraty?license=${c}`}
                    className="rounded-md border border-[var(--color-line)] bg-[var(--color-canvas)] px-2 py-1 text-xs font-semibold tabular-nums text-[var(--color-ink-muted)] transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)]"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </article>

            <article className="sm:col-span-3 relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-800)]">
                <Shield />
              </span>
              <h3 className="display-xs text-xl text-[var(--color-ink)] sm:text-2xl">
                Ověřené autoškoly
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                Každá autoškola se při registraci ověří přes ARES — IČO,
                obchodní jméno a sídlo z veřejného rejstříku. Inzeráty nikdy
                neztrácí kontext právního subjektu.
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Pill variant="brand">
                  <Tick small /> Ověřeno z ARES
                </Pill>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* DARK BAND =================================================== */}
      <section className="dark-band relative overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6">
              <Eyebrow tone="light">Jak to funguje</Eyebrow>
              <h2 className="display-md mt-3 text-4xl text-white sm:text-5xl md:text-6xl">
                Od profilu k domluvě —{" "}
                <em className="font-display italic font-medium text-[var(--color-brand-300)]">
                  čtyři kroky.
                </em>
              </h2>
            </div>
            <ol className="md:col-span-6 grid gap-3 text-sm">
              {[
                {
                  n: "01",
                  title: "Profil",
                  body: "Autoškola se ověří přes IČO. Profesionál vyplní role + kategorie ŘP + dojezd.",
                },
                {
                  n: "02",
                  title: "Inzerát „hledám“",
                  body: "Obě strany zveřejní vlastní inzerát. Povinné platové rozmezí, role, kategorie ŘP.",
                },
                {
                  n: "03",
                  title: "Matching",
                  body: "Algoritmus skóruje protistrany podle role, ŘP, dojezdu, sazeb a verifikace.",
                },
                {
                  n: "04",
                  title: "Zpráva",
                  body: "Píšete přímo na webu. Anonymní profesionál se odhalí, jakmile sám napíše.",
                },
              ].map((step) => (
                <li
                  key={step.n}
                  className="flex gap-5 rounded-2xl border border-white/10 bg-[var(--color-paper)]/5 p-5 backdrop-blur"
                >
                  <span className="display-xs text-2xl tabular-nums text-[var(--color-brand-300)]">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-stone-300">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
            {[
              { v: "30+", l: "měst v ČR" },
              { v: "6", l: "rolí oboru" },
              { v: "120+", l: "specializovaných stránek" },
              { v: "3 zdarma", l: "pak 299 / 790 Kč za inzerát" },
            ].map((s) => (
              <div key={s.l}>
                <p className="display-md text-4xl text-white tabular-nums sm:text-5xl">
                  {s.v}
                </p>
                <p className="mt-2 text-sm text-stone-400">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES =================================================== */}
      <section className="relative">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Práce v autoškole · podle města</Eyebrow>
              <h2 className="display-sm mt-3 text-3xl text-[var(--color-ink)] sm:text-4xl md:text-5xl">
                Najdi to{" "}
                <em className="font-display italic font-medium text-[var(--color-brand-800)]">
                  ve svém kraji
                </em>
              </h2>
            </div>
            <Link
              href="/prace-v-autoskole"
              className="text-sm font-medium text-[var(--color-brand-700)] hover:underline"
            >
              Všechna města a role →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TOP_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/prace-v-autoskole/${c.slug}`}
                className="group flex flex-col gap-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-brand-700)] hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="display-xs text-base text-[var(--color-ink)]">
                  {c.name}
                </span>
                <span className="text-xs text-[var(--color-ink-soft)] transition group-hover:text-[var(--color-brand-700)]">
                  Práce v autoškole →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA ================================================== */}
      <section className="relative">
        <div className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] px-8 py-16 sm:px-14 sm:py-20">
            <div className="aurora">
              <div className="blob" />
            </div>
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="display-md text-3xl text-[var(--color-ink)] sm:text-5xl md:text-6xl">
                Buď u toho od{" "}
                <em className="font-display italic font-medium text-[var(--color-brand-800)]">
                  prvního inzerátu.
                </em>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
                První tři inzeráty zdarma — zaplatíš až další. Žádné předplatné, žádný spam.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {session ? (
                  <ButtonLink href="/listings/new" size="lg" className="group">
                    Vytvořit první inzerát <ArrowRight />
                  </ButtonLink>
                ) : (
                  <ButtonLink href="/sign-up" size="lg" className="group">
                    Vytvořit účet <ArrowRight />
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Tick({ small }: { small?: boolean }) {
  const s = small ? 11 : 12;
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 6.22a.75.75 0 00-1.06-1.06L7 8.88 5.78 7.66a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l4.25-4.25z" />
    </svg>
  );
}

function DotPair() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="7" cy="12" r="3.5" fill="currentColor" />
      <circle cx="17" cy="12" r="3.5" fill="currentColor" opacity="0.5" />
      <line x1="10.5" y1="12" x2="13.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Steering() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 9.5V3.5M9.5 13.2 5 18M14.5 13.2 19 18" />
    </svg>
  );
}

function Shield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 3l8 3v6c0 4.5-3.5 7.8-8 9-4.5-1.2-8-4.5-8-9V6l8-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
