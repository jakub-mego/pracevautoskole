import Link from "next/link";
import type { profiles, listings } from "../../../drizzle/schema";
import { AresVerifiedBadge } from "./ares-verified-badge";
import { VerifiedProfessionalBadge } from "@/components/profiles/verified-professional-badge";

type Listing = typeof listings.$inferSelect;
type Profile = typeof profiles.$inferSelect;

export function ListingCard({
  listing,
  profile,
  anonymous = false,
  aresVerified = false,
  professionalVerified = false,
}: {
  listing: Listing;
  profile: Profile;
  anonymous?: boolean;
  aresVerified?: boolean;
  professionalVerified?: boolean;
}) {
  const cityRegion = [listing.city, listing.region].filter(Boolean).join(" · ");
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-brand-700)] hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
            {listing.type === "employer_seeks"
              ? "Autoškola hledá"
              : "Profesionál nabízí sebe"}
          </span>
          <Link href={`/inzeraty/${listing.id}`}>
            <h3 className="display-xs mt-1.5 text-lg text-[var(--color-ink)] sm:text-xl">
              {listing.title}
            </h3>
          </Link>
        </div>
      </div>
      <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-ink-muted)]">
        {anonymous ? (
          <span className="font-medium">{profile.displayName}</span>
        ) : (
          <Link
            href={`/p/${profile.slug}`}
            className="font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-700)] hover:underline"
          >
            {profile.displayName}
          </Link>
        )}
        {aresVerified ? <AresVerifiedBadge /> : null}
        {professionalVerified ? <VerifiedProfessionalBadge /> : null}
        {cityRegion ? (
          <span className="text-[var(--color-ink-soft)]">· {cityRegion}</span>
        ) : null}
      </p>
      <Link href={`/inzeraty/${listing.id}`} className="block">
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {listing.description}
        </p>
      </Link>
      <div className="mt-5 flex items-center justify-between border-t border-[var(--color-line-soft)] pt-4 text-xs">
        {listing.publishedAt ? (
          <span className="text-[var(--color-ink-soft)]">
            Zveřejněno{" "}
            {new Date(listing.publishedAt).toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "long",
            })}
          </span>
        ) : (
          <span className="text-[var(--color-ink-soft)]">Nezveřejněno</span>
        )}
        <Link
          href={`/inzeraty/${listing.id}`}
          className="font-semibold text-[var(--color-brand-700)] transition group-hover:translate-x-0.5"
        >
          Detail →
        </Link>
      </div>
    </li>
  );
}
