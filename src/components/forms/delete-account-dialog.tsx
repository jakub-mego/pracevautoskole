"use client";

import { useState, useTransition } from "react";
import { deleteAccountAction } from "@/app/profile/actions";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit() {
    setError(null);
    start(async () => {
      const result = await deleteAccountAction({ confirm });
      if (result?.error) setError(result.error);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-[var(--color-danger)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]"
      >
        Smazat účet
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-bg)] p-4">
      <p className="text-sm text-[var(--color-danger)]">
        Smazání účtu je <strong>nevratné</strong>. Smaže se uživatel, profil,
        všechny inzeráty a sessiony. Pro potvrzení napiš{" "}
        <code className="rounded bg-[var(--color-paper)] px-1 py-0.5 font-mono">SMAZAT</code>.
      </p>
      <input
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoFocus
        className="rounded-md border border-[var(--color-danger)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-red-700 focus:outline-none"
        placeholder="SMAZAT"
      />
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={pending || confirm !== "SMAZAT"}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
        >
          {pending ? "Mažu…" : "Smazat účet nevratně"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setConfirm("");
            setError(null);
          }}
          disabled={pending}
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
        >
          Zrušit
        </button>
      </div>
    </div>
  );
}
