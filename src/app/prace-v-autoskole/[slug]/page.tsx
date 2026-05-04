import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SEO_CITIES,
  SEO_ROLES,
  getCityBySlug,
  getRoleBySlug,
  type SeoRole,
} from "@/lib/seo/landing-data";
import { listLandingListings } from "@/lib/listings/queries";
import { LandingListingList } from "@/components/marketing/landing-listing-list";

// Renderujeme na request, ne při buildu — build kontejner nemá síť na DB.
// Cache na CDN/proxy řešíme `revalidate`em (1 hod = stačí pro inzeráty).
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  const role = getRoleBySlug(slug);
  if (city) {
    return {
      title: `Práce v autoškole ${city.name}`,
      description: `Aktuální nabídky práce v autoškolách v ${city.name}. Inzeráty na učitele, lektory a další pozice oboru.`,
    };
  }
  if (role) {
    return {
      title: `${role.name} — práce, plat, kvalifikace`,
      description: role.shortIntro,
    };
  }
  return { title: "Stránka nenalezena" };
}

function fmtCzk(n: number): string {
  return new Intl.NumberFormat("cs-CZ").format(n) + " Kč";
}

function SalaryBox({ salary }: { salary: SeoRole["salary"] }) {
  const monthly =
    salary.minMonthlyCzk && salary.maxMonthlyCzk
      ? `${fmtCzk(salary.minMonthlyCzk)} – ${fmtCzk(salary.maxMonthlyCzk)} / měsíc`
      : null;
  const hourly =
    salary.minHourlyCzk && salary.maxHourlyCzk
      ? `${fmtCzk(salary.minHourlyCzk)} – ${fmtCzk(salary.maxHourlyCzk)} / hod`
      : null;
  return (
    <div className="rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-800)]">
        Orientační odměna
      </p>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
        {monthly ? (
          <p className="text-base font-semibold text-[var(--color-ink)] tabular-nums">
            {monthly}
          </p>
        ) : null}
        {hourly ? (
          <p className="text-base font-semibold text-[var(--color-ink)] tabular-nums">
            {hourly}
          </p>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{salary.note}</p>
    </div>
  );
}

function RoleStructuredData({ role }: { role: SeoRole }) {
  const occupation = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: role.name,
    description: role.shortIntro,
    occupationLocation: { "@type": "Country", name: "Česká republika" },
    estimatedSalary:
      role.salary.minMonthlyCzk && role.salary.maxMonthlyCzk
        ? {
            "@type": "MonetaryAmountDistribution",
            name: "měsíční hrubá mzda",
            currency: "CZK",
            duration: "P1M",
            minValue: role.salary.minMonthlyCzk,
            maxValue: role.salary.maxMonthlyCzk,
          }
        : undefined,
    qualifications: role.qualifications.join(" "),
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: role.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(occupation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}

export default async function LandingSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  const role = getRoleBySlug(slug);
  if (!city && !role) notFound();

  if (city) {
    const rows = await listLandingListings({ cityName: city.name });
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">{city.region}</p>
        <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
          Práce v autoškole {city.name}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
          Aktuální nabídky práce a inzeráty profesionálů v autoškolách v {city.name}.
          Najdeš tu poptávky autoškol po učitelích a lektorech i nabídky
          profesionálů, kteří hledají místo.
        </p>
        {city.marketNote ? (
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-ink-muted)]">
            {city.marketNote}
          </p>
        ) : null}

        <section className="mt-8">
          <h2 className="display-xs text-lg text-[var(--color-ink)]">
            Inzeráty z {city.name}
          </h2>
          <div className="mt-4">
            <LandingListingList
              rows={rows}
              emptyMessage={`Pro ${city.name} momentálně nejsou aktivní inzeráty.`}
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="display-xs text-lg text-[var(--color-ink)]">
            Profese v autoškolách
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Specializované landing stránky podle role v {city.name}:
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SEO_ROLES.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/prace-v-autoskole/${r.slug}/${city.slug}`}
                  className="text-sm text-[var(--color-ink-muted)] underline hover:text-[var(--color-ink)]"
                >
                  {r.name} v {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    );
  }

  // Role landing — long-form SEO content
  const r = role!;
  const rows = await listLandingListings({ role: r.role });
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <RoleStructuredData role={r} />

      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">Profese v autoškole</p>
      <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-5xl">
        {r.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]">
        {r.shortIntro}
      </p>

      <section className="mt-8 flex flex-col gap-4">
        {r.longIntro.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-[var(--color-ink)]">
            {p}
          </p>
        ))}
      </section>

      <section className="mt-10">
        <SalaryBox salary={r.salary} />
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-xl text-[var(--color-ink)]">Kvalifikace a podmínky</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-[var(--color-ink)]">
          {r.qualifications.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-xl text-[var(--color-ink)]">Co práce obnáší v praxi</h2>
        <div className="mt-4 flex flex-col gap-4">
          {r.typicalDay.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-[var(--color-ink)]">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-xl text-[var(--color-ink)]">Jak se {r.name.toLowerCase()} stát</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-[15px] leading-relaxed text-[var(--color-ink)]">
          {r.howToBecome.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-10 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <h2 className="display-xs text-xl text-[var(--color-ink)]">
          Hledáš místo, nebo někoho do týmu?
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          {r.namePlural} si na pracevautoskole.cz mohou založit profil zdarma a
          zveřejnit svůj inzerát. Autoškoly hledající právě tuhle pozici mohou
          inzerovat poptávku — první 3 inzeráty zdarma.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/sign-up"
            className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-900)]"
          >
            Vytvořit profil zdarma
          </Link>
          <Link
            href="/inzeraty"
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            Procházet inzeráty
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-xl text-[var(--color-ink)]">
          Aktuální inzeráty na pozici {r.name.toLowerCase()}
        </h2>
        <div className="mt-4">
          <LandingListingList
            rows={rows}
            emptyMessage="Pro tuto pozici aktuálně nejsou inzeráty. Můžeš být první, kdo svůj zveřejní."
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-xl text-[var(--color-ink)]">Časté otázky</h2>
        <div className="mt-4 flex flex-col gap-2">
          {r.faq.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4 open:border-[var(--color-brand-700)]"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-[var(--color-ink)]">
                {item.q}
                <span className="float-right text-[var(--color-ink-soft)] transition group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-xl text-[var(--color-ink)]">Podle města</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Práce na pozici {r.name.toLowerCase()} v jednotlivých krajích:
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {SEO_CITIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/prace-v-autoskole/${r.slug}/${c.slug}`}
                className="text-sm text-[var(--color-ink-muted)] underline hover:text-[var(--color-ink)]"
              >
                {r.name} v {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {r.related && r.related.length ? (
        <section className="mt-10">
          <h2 className="display-xs text-xl text-[var(--color-ink)]">Související profese</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {r.related.map((relSlug) => {
              const rel = SEO_ROLES.find((x) => x.slug === relSlug);
              if (!rel) return null;
              return (
                <li key={relSlug}>
                  <Link
                    href={`/prace-v-autoskole/${rel.slug}`}
                    className="text-sm font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
                  >
                    {rel.name} →
                  </Link>
                  <p className="text-xs text-[var(--color-ink-soft)]">{rel.shortIntro}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
