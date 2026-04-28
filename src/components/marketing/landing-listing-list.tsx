import Link from "next/link";
import { ListingCard } from "@/components/listings/listing-card";
import type {
  profiles as profilesSchema,
  listings as listingsSchema,
} from "../../../drizzle/schema";

type Row = {
  listing: typeof listingsSchema.$inferSelect;
  profile: typeof profilesSchema.$inferSelect;
  anonymous: boolean | null;
  professionalVerification: string | null;
  aresVerifiedAt: Date | null;
};

export function LandingListingList({
  rows,
  emptyMessage,
}: {
  rows: Row[];
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-6 text-sm text-[var(--color-ink-muted)]">
        {emptyMessage}{" "}
        <Link href="/inzeraty" className="font-medium text-[var(--color-ink)] underline">
          Procházej všechny inzeráty
        </Link>
        .
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => (
        <ListingCard
          key={r.listing.id}
          listing={r.listing}
          profile={r.profile}
          anonymous={r.anonymous ?? false}
          aresVerified={Boolean(r.aresVerifiedAt)}
          professionalVerified={r.professionalVerification === "verified"}
        />
      ))}
    </ul>
  );
}
