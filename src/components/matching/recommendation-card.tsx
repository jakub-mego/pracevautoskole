import Link from "next/link";
import type { Recommendation } from "@/lib/matching/queries";
import type { ScoreReason } from "@/lib/matching/score";
import { PROFESSIONAL_ROLE_LABELS } from "@/lib/profiles/labels";

function reasonLabel(reason: ScoreReason): string {
  switch (reason.kind) {
    case "role_match": {
      const labels = reason.roles
        .map((r) => PROFESSIONAL_ROLE_LABELS[r] ?? r)
        .join(", ");
      return `Role: ${labels}`;
    }
    case "license_match":
      return `Kategorie ŘP: ${reason.licenses.join(", ")}`;
    case "same_region":
      return `Stejný kraj — ${reason.region}`;
    case "same_city":
      return `Stejné město — ${reason.city}`;
    case "rate_overlap":
      return "Sazby se překrývají";
    case "verified":
      return "Ověřená protistrana";
  }
}

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { match, listing, ownerProfile, ownerAnonymous } = rec;
  const reasons = (match.reasons as ScoreReason[]) ?? [];
  const cityRegion = [listing.city, listing.region].filter(Boolean).join(" · ");
  return (
    <li className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 transition hover:border-[var(--color-brand-700)]">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/inzeraty/${listing.id}`} className="flex-1">
          <h3 className="display-xs text-base text-[var(--color-ink)]">
            {listing.title}
          </h3>
        </Link>
        <span className="rounded-full bg-[var(--color-brand-100)] px-2 py-0.5 text-xs font-semibold text-[var(--color-brand-800)]">
          {match.score} %
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        {ownerAnonymous ? (
          <span>{ownerProfile.displayName}</span>
        ) : (
          <Link
            href={`/p/${ownerProfile.slug}`}
            className="font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:underline"
          >
            {ownerProfile.displayName}
          </Link>
        )}
        {cityRegion ? <span> · {cityRegion}</span> : null}
      </p>
      {reasons.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {reasons.map((r, i) => (
            <li
              key={i}
              className="rounded-md bg-[var(--color-canvas-muted)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)]"
            >
              {reasonLabel(r)}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
