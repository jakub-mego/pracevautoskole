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

export async function generateStaticParams() {
  return [...SEO_CITIES, ...SEO_ROLES].map((x) => ({ slug: x.slug }));
}

export const dynamic = "force-static";
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
      description: `Aktuální nabídky práce v autoškolách v ${city.name}. Inzeráty na učitele, mistry odborného výcviku a lektory.`,
    };
  }
  if (role) {
    return {
      title: `Práce: ${role.name} v autoškolách v ČR`,
      description: `Aktuální nabídky pro pozici ${role.name.toLowerCase()} v autoškolách napříč ČR.`,
    };
  }
  return { title: "Stránka nenalezena" };
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

  // Role landing
  const r = role!;
  const rows = await listLandingListings({ role: r.role });
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">Profese</p>
      <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">
        {r.name} — práce v autoškole v ČR
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">{r.intro}</p>

      <section className="mt-8">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">
          Aktuální inzeráty na pozici {r.name.toLowerCase()}
        </h2>
        <div className="mt-4">
          <LandingListingList
            rows={rows}
            emptyMessage="Pro tuto pozici aktuálně nejsou inzeráty."
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">Podle města</h2>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
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
    </main>
  );
}
