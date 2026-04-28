"use client";

import { useState, useTransition } from "react";
import { createReportAction } from "@/app/reports/actions";
import { REPORT_REASON_LABELS } from "@/lib/reports/labels";

export function ReportDialog({
  targetType,
  targetId,
  size = "sm",
}: {
  targetType: "listing" | "profile";
  targetId: string;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  function submit() {
    setError(null);
    start(async () => {
      const result = await createReportAction({
        targetType,
        targetId,
        reason,
        note,
      });
      if (result && "error" in result) {
        setError(result.error);
        return;
      }
      setDone(true);
    });
  }

  if (!open) {
    const cls =
      size === "md"
        ? "rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
        : "text-xs text-[var(--color-ink-soft)] underline hover:text-[var(--color-ink)]";
    return (
      <button type="button" onClick={() => setOpen(true)} className={cls}>
        Nahlásit
      </button>
    );
  }

  if (done) {
    return (
      <div className="rounded-md border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-3 text-sm text-[var(--color-brand-900)]">
        Děkujeme. Report jsme přijali — moderátor se na to podívá.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
      <p className="font-medium text-amber-900">
        Nahlásit{" "}
        {targetType === "listing" ? "inzerát" : "profil"}
      </p>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-[var(--color-ink-muted)]">Důvod</span>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm"
        >
          {Object.entries(REPORT_REASON_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-[var(--color-ink-muted)]">
          Poznámka (volitelné)
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
          rows={3}
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm"
          placeholder="Popis, co je s obsahem v nepořádku."
        />
      </label>
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-md bg-[var(--color-ink)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
        >
          {pending ? "Odesílám…" : "Odeslat report"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
            setNote("");
          }}
          disabled={pending}
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
        >
          Zrušit
        </button>
      </div>
    </div>
  );
}
