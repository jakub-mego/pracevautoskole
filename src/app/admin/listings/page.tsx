import Link from "next/link";
import { listAdminListings } from "@/lib/admin/queries";
import { ListingStatusBadge } from "@/components/listings/listing-status-badge";
import { AdminListingRowActions } from "@/components/admin/admin-listing-row-actions";

export default async function AdminListingsPage() {
  const rows = await listAdminListings();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        Inzeráty ({rows.length})
      </h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
            <tr>
              <th className="px-4 py-3">Titulek</th>
              <th className="px-4 py-3">Typ</th>
              <th className="px-4 py-3">Vlastník</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Akce</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ listing, profile }) => (
              <tr
                key={listing.id}
                className="border-b border-zinc-100 last:border-0"
              >
                <td className="px-4 py-2">
                  <Link
                    href={`/inzeraty/${listing.id}`}
                    className="font-medium text-[var(--color-ink)] hover:underline"
                  >
                    {listing.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-xs text-[var(--color-ink-muted)]">
                  {listing.type === "employer_seeks" ? "Hledá" : "Nabízí"}
                </td>
                <td className="px-4 py-2 text-xs text-[var(--color-ink-muted)]">
                  <Link href={`/p/${profile.slug}`} className="hover:underline">
                    {profile.displayName}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <ListingStatusBadge status={listing.status} />
                </td>
                <td className="px-4 py-2 text-xs text-[var(--color-ink-soft)]">
                  {new Date(listing.updatedAt).toLocaleString("cs-CZ")}
                </td>
                <td className="px-4 py-2">
                  <AdminListingRowActions
                    listingId={listing.id}
                    status={listing.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
