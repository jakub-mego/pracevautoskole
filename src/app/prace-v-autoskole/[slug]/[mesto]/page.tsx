import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SEO_CITIES,
  SEO_ROLES,
  getCityBySlug,
  getRoleBySlug,
} from "@/lib/seo/landing-data";
import { listLandingListings } from "@/lib/listings/queries";
import { LandingListingList } from "@/components/marketing/landing-listing-list";

// Renderujeme na request, ne při buildu — build kontejner nemá síť na DB.
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; mesto: string }>;
}) {
  const { slug, mesto } = await params;
  const r = getRoleBySlug(slug);
  const c = getCityBySlug(mesto);
  if (!r || !c) return { title: "Stránka nenalezena" };
  return {
    title: `${r.name} ${c.name} — práce v autoškole`,
    description: `Aktuální nabídky práce na pozici ${r.name.toLowerCase()} v autoškolách v ${c.name} (${c.region}).`,
  };
}

export default async function LandingComboPage({
  params,
}: {
  params: Promise<{ slug: string; mesto: string }>;
}) {
  const { slug, mesto } = await params;
  const r = getRoleBySlug(slug);
  const c = getCityBySlug(mesto);
  if (!r || !c) notFound();

  const rows = await listLandingListings({ role: r.role, cityName: c.name });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <nav className="text-sm text-[var(--color-ink-muted)]">
        <Link href="/prace-v-autoskole" className="hover:text-[var(--color-ink)]">
          Práce v autoškole
        </Link>
        {" · "}
        <Link
          href={`/prace-v-autoskole/${r.slug}`}
          className="hover:text-[var(--color-ink)]"
        >
          {r.name}
        </Link>
        {" · "}
        <Link
          href={`/prace-v-autoskole/${c.slug}`}
          className="hover:text-[var(--color-ink)]"
        >
          {c.name}
        </Link>
      </nav>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
        {r.name} {c.name}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
        Aktuální nabídky práce na pozici <strong>{r.name.toLowerCase()}</strong> v
        autoškolách v {c.name} ({c.region}). {r.shortIntro}
      </p>
      {c.marketNote ? (
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          {c.marketNote}
        </p>
      ) : null}
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-ink-muted)]">
        Detail profese, kvalifikace a orientační odměna na samostatné stránce{" "}
        <Link
          href={`/prace-v-autoskole/${r.slug}`}
          className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
        >
          {r.name} — celostátní přehled
        </Link>
        .
      </p>

      <section className="mt-8">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">
          Inzeráty: {r.name} v {c.name}
        </h2>
        <div className="mt-4">
          <LandingListingList
            rows={rows}
            emptyMessage={`V ${c.name} momentálně nemáme aktivní inzerát na pozici ${r.name.toLowerCase()}.`}
          />
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h2 className="display-xs text-base text-[var(--color-ink)]">
            Další profese v {c.name}
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {SEO_ROLES.filter((x) => x.slug !== r.slug).map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/prace-v-autoskole/${x.slug}/${c.slug}`}
                  className="text-sm text-[var(--color-ink-muted)] underline hover:text-[var(--color-ink)]"
                >
                  {x.name} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="display-xs text-base text-[var(--color-ink)]">
            {r.name} v dalších městech
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {SEO_CITIES.filter((x) => x.slug !== c.slug)
              .slice(0, 12)
              .map((x) => (
                <li key={x.slug}>
                  <Link
                    href={`/prace-v-autoskole/${r.slug}/${x.slug}`}
                    className="text-sm text-[var(--color-ink-muted)] underline hover:text-[var(--color-ink)]"
                  >
                    {x.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
