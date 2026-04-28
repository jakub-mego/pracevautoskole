"use client";

import { useState, useTransition } from "react";
import { adminResolveReportAction } from "@/app/admin/actions";

export function AdminReportRowActions({ reportId }: { reportId: string }) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  function commit(status: "resolved" | "dismissed") {
    start(async () => {
      await adminResolveReportAction({ reportId, status, note });
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-0.5 text-xs hover:bg-[var(--color-canvas-muted)]"
      >
        Vyřešit
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Poznámka (volitelné)"
        className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-1 text-xs"
      />
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => commit("resolved")}
          disabled={pending}
          className="rounded bg-[var(--color-ink)] px-2 py-0.5 text-xs font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
        >
          Vyřešit
        </button>
        <button
          type="button"
          onClick={() => commit("dismissed")}
          disabled={pending}
          className="rounded border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-0.5 text-xs hover:bg-[var(--color-canvas-muted)]"
        >
          Zamítnout
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-0.5 text-xs"
        >
          Zrušit
        </button>
      </div>
    </div>
  );
}
