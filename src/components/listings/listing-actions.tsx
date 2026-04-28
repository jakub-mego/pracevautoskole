"use client";

import { useState, useTransition } from "react";
import {
  publishListingAction,
  pauseListingAction,
  archiveListingAction,
  deleteListingAction,
} from "@/app/listings/actions";
import type { ListingStatusKey } from "@/lib/listings/labels";

export function ListingActions({
  id,
  status,
}: {
  id: string;
  status: ListingStatusKey;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function publish() {
    setError(null);
    start(async () => {
      const result = await publishListingAction(id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(status === "draft" || status === "paused" || status === "expired") && (
          <button
            type="button"
            onClick={publish}
            disabled={pending}
            className="rounded-md bg-[var(--color-ink)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
          >
            {status === "draft" ? "Zveřejnit" : "Aktivovat znovu"}
          </button>
        )}
        {status === "active" && (
          <button
            type="button"
            onClick={() => start(() => pauseListingAction(id))}
            disabled={pending}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)] disabled:opacity-60"
          >
            Pozastavit
          </button>
        )}
        {status !== "archived" && (
          <button
            type="button"
            onClick={() => start(() => archiveListingAction(id))}
            disabled={pending}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)] disabled:opacity-60"
          >
            Archivovat
          </button>
        )}
        {status === "draft" && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Smazat koncept? Akci nelze vzít zpět.")) {
                start(() => deleteListingAction(id));
              }
            }}
            disabled={pending}
            className="rounded-md border border-[var(--color-danger)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] disabled:opacity-60"
          >
            Smazat
          </button>
        )}
      </div>
      {error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </p>
      ) : null}
    </div>
  );
}
