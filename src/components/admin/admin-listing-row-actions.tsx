"use client";

import { useTransition } from "react";
import {
  adminArchiveListingAction,
  adminDeleteListingAction,
} from "@/app/admin/actions";

export function AdminListingRowActions({
  listingId,
  status,
}: {
  listingId: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-1.5">
      {status !== "archived" && (
        <button
          type="button"
          onClick={() => start(() => adminArchiveListingAction(listingId))}
          disabled={pending}
          className="rounded border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-0.5 text-xs hover:bg-[var(--color-canvas-muted)]"
        >
          Archivovat
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          if (confirm("Smazat inzerát natvrdo?")) {
            start(() => adminDeleteListingAction(listingId));
          }
        }}
        disabled={pending}
        className="rounded border border-red-300 bg-[var(--color-paper)] px-2 py-0.5 text-xs text-red-700 hover:bg-red-50"
      >
        Smazat
      </button>
    </div>
  );
}
