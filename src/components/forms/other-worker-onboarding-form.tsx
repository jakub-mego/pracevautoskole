"use client";

import { useActionState } from "react";
import { createOtherWorkerProfileAction } from "@/app/onboarding/actions";

export function OtherWorkerOnboardingForm() {
  const [state, formAction, pending] = useActionState(
    createOtherWorkerProfileAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">Zobrazované jméno</span>
        <input
          name="displayName"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          className="rounded-md border border-[var(--color-line-strong)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Město</span>
          <input
            name="city"
            maxLength={80}
            className="rounded-md border border-[var(--color-line-strong)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Kraj</span>
          <input
            name="region"
            maxLength={80}
            className="rounded-md border border-[var(--color-line-strong)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      </div>

      <p className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-3 text-xs text-[var(--color-ink-muted)]">
        Konkrétní roli (admin, zdravotník, jiné) si zvolíš v dashboardu po vytvoření účtu.
      </p>

      {state?.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
      >
        {pending ? "Vytvářím…" : "Vytvořit profil"}
      </button>
    </form>
  );
}
