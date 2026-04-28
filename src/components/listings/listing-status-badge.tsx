import { cn } from "@/lib/utils/cn";
import {
  LISTING_STATUS_LABELS,
  type ListingStatusKey,
} from "@/lib/listings/labels";

const STATUS_STYLES: Record<ListingStatusKey, string> = {
  draft: "bg-[var(--color-canvas-muted)] text-[var(--color-ink-muted)]",
  pending_payment: "bg-amber-100 text-amber-800",
  active: "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]",
  paused: "bg-[var(--color-line)] text-[var(--color-ink-muted)]",
  expired: "bg-red-100 text-red-800",
  archived: "bg-[var(--color-canvas-muted)] text-[var(--color-ink-soft)]",
};

export function ListingStatusBadge({ status }: { status: ListingStatusKey }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {LISTING_STATUS_LABELS[status]}
    </span>
  );
}
