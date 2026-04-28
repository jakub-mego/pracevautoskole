"use client";

import { useState, useTransition } from "react";
import {
  adminApproveCredentialsAction,
  adminRejectCredentialsAction,
} from "@/app/admin/actions";

export function AdminCredentialRowActions({ profileId }: { profileId: string }) {
  const [pending, start] = useTransition();
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function approve() {
    start(async () => {
      setError(null);
      const res = await adminApproveCredentialsAction(profileId);
      if (res?.error) setError(res.error);
    });
  }

  function reject() {
    start(async () => {
      setError(null);
      const res = await adminRejectCredentialsAction({ profileId, reason });
      if (res?.error) setError(res.error);
      else setOpen(false);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={approve}
          disabled={pending}
          className="rounded bg-[var(--color-brand-600)] px-2 py-0.5 text-xs font-medium text-white hover:bg-[var(--color-brand-700)] disabled:opacity-60"
        >
          Schválit
        </button>
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          disabled={pending}
          className="rounded border border-red-300 bg-[var(--color-paper)] px-2 py-0.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
        >
          Zamítnout
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-1.5">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Důvod (alespoň 5 znaků)"
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-1 text-xs"
          />
          <button
            type="button"
            onClick={reject}
            disabled={pending || reason.trim().length < 5}
            className="self-start rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            Potvrdit zamítnutí
          </button>
        </div>
      ) : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
