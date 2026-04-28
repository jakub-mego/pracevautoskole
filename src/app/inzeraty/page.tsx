import Link from "next/link";
import { listPublicListings } from "@/lib/listings/queries";
import { ListingCard } from "@/components/listings/listing-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";

export const metadata = {
  title: "Inzeráty",
};

type Search = Promise<{
  type?: string;
  region?: string;
  page?: string;
}>;

export default async function PublicListingsFeed({
  searchParams,
}: {
  searchParams: Search;
}) {
  const sp = await searchParams;
  const type =
    sp.type === "employer_seeks" || sp.type === "professional_seeks"
      ? sp.type
      : undefined;
  const region = sp.region?.trim() || undefined;
  const page = Math.max(parseInt(sp.page ?? "1", 10) || 1, 1);

  const { rows, total, perPage } = await listPublicListings({
    type,
    region,
    page,
  });
  const totalPages = Math.max(Math.ceil(total / perPage), 1);

  return (
    <main className="relative">
      <div className="absolute inset-0 surface-grain pointer-events-none opacity-30" />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-12">
        <Eyebrow>Veřejný feed</Eyebrow>
        <h1 className="display-md mt-2 text-4xl text-[var(--color-ink)] sm:text-5xl">
          Inzeráty
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--color-ink-muted)]">
          Aktivní poptávky autoškol i nabídky profesionálů. Filtruj typ a kraj.
        </p>

        <form className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
          <label className="flex flex-1 flex-col gap-1.5 sm:max-w-[180px]">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Typ
            </span>
            <select
              name="type"
              defaultValue={type ?? ""}
              className={fieldClass}
            >
              <option value="">Vše</option>
              <option value="employer_seeks">Autoškola hledá</option>
              <option value="professional_seeks">Profesionál nabízí sebe</option>
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1.5 sm:max-w-[220px]">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Kraj
            </span>
            <input
              name="region"
              defaultValue={region ?? ""}
              placeholder="Praha"
              className={fieldClass}
            />
          </label>
          <Button type="submit" size="md">
            Filtrovat
          </Button>
          {(type || region) && (
            <Link
              href="/inzeraty"
              className="self-center text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:underline"
            >
              Vyčistit
            </Link>
          )}
        </form>

        <p className="mt-6 text-sm text-[var(--color-ink-muted)] tabular-nums">
          {total} {total === 1 ? "výsledek" : total < 5 ? "výsledky" : "výsledků"}
        </p>

        {rows.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-10 text-center">
            <p className="display-xs text-xl text-[var(--color-ink)]">
              Žádné inzeráty zatím nejsou
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Buď první. Vytvoř účet a zveřejni inzerát.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map(
              ({
                listing,
                profile,
                anonymous,
                aresVerifiedAt,
                professionalVerification,
              }) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  profile={profile}
                  anonymous={anonymous ?? false}
                  aresVerified={Boolean(aresVerifiedAt)}
                  professionalVerified={professionalVerification === "verified"}
                />
              ),
            )}
          </ul>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const params = new URLSearchParams();
              if (type) params.set("type", type);
              if (region) params.set("region", region);
              if (p > 1) params.set("page", String(p));
              const href = `/inzeraty${params.toString() ? `?${params}` : ""}`;
              const active = p === page;
              return (
                <Link
                  key={p}
                  href={href}
                  className={
                    active
                      ? "rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold tabular-nums text-[var(--color-canvas)]"
                      : "rounded-full border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm tabular-nums text-[var(--color-ink-muted)] transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)]"
                  }
                >
                  {p}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </main>
  );
}
