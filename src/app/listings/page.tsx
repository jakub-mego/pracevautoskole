import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { getListingsForProfile } from "@/lib/listings/queries";
import { ListingStatusBadge } from "@/components/listings/listing-status-badge";

export const metadata = {
  title: "Moje inzeráty",
};

export default async function ListingsIndexPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");

  const rows = await getListingsForProfile(profile.id);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
          Moje inzeráty
        </h1>
        <Link
          href="/listings/new"
          className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)]"
        >
          Nový inzerát
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-8 text-center text-[var(--color-ink-muted)]">
          Zatím nemáš žádný inzerát. Začni{" "}
          <Link href="/listings/new" className="font-medium text-[var(--color-ink)] underline">
            tady
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/listings/${row.id}/edit`}
                    className="text-base font-medium text-[var(--color-ink)] hover:underline"
                  >
                    {row.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-ink-soft)]">
                    <ListingStatusBadge status={row.status} />
                    {row.publishedAt ? (
                      <span>
                        Zveřejněno {new Date(row.publishedAt).toLocaleDateString("cs-CZ")}
                      </span>
                    ) : null}
                    {row.expiresAt && row.status === "active" ? (
                      <span>
                        Expiruje {new Date(row.expiresAt).toLocaleDateString("cs-CZ")}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
