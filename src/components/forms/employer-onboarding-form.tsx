"use client";

import { useActionState, useState } from "react";
import { lookupIcoAction, createEmployerProfileAction } from "@/app/onboarding/actions";
import type { AresSubject } from "@/lib/ares/client";

export function EmployerOnboardingForm() {
  const [ico, setIco] = useState("");
  const [subject, setSubject] = useState<AresSubject | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const [state, formAction, pending] = useActionState(
    createEmployerProfileAction,
    undefined,
  );

  async function onLookup() {
    setLookupError(null);
    setSubject(null);
    setLookingUp(true);
    const result = await lookupIcoAction(ico);
    setLookingUp(false);
    if (result.ok) setSubject(result.subject);
    else setLookupError(result.error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="ico-input" className="text-sm font-medium text-[var(--color-ink-muted)]">
          IČO autoškoly
        </label>
        <div className="flex gap-2">
          <input
            id="ico-input"
            inputMode="numeric"
            maxLength={8}
            value={ico}
            onChange={(e) => setIco(e.target.value.replace(/\D/g, "").slice(0, 8))}
            className="flex-1 rounded-md border border-[var(--color-line-strong)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            placeholder="12345678"
          />
          <button
            type="button"
            onClick={onLookup}
            disabled={lookingUp || ico.length !== 8}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-canvas)] disabled:opacity-60"
          >
            {lookingUp ? "Načítám…" : "Načíst z ARES"}
          </button>
        </div>
        {lookupError ? <p className="text-sm text-[var(--color-danger)]">{lookupError}</p> : null}
      </div>

      {subject ? (
        <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
          <div className="space-y-1 text-sm">
            <p className="font-medium text-[var(--color-ink)]">{subject.obchodniJmeno}</p>
            <p className="text-[var(--color-ink-muted)]">IČO: {subject.ico}</p>
            {subject.sidlo?.textovaAdresa ? (
              <p className="text-[var(--color-ink-muted)]">{subject.sidlo.textovaAdresa}</p>
            ) : null}
          </div>

          <input type="hidden" name="ico" value={subject.ico} />

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--color-ink-muted)]">Zobrazované jméno</span>
            <input
              name="displayName"
              defaultValue={subject.obchodniJmeno}
              required
              minLength={2}
              maxLength={120}
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--color-ink-muted)]">Město (volitelné)</span>
            <input
              name="city"
              defaultValue={subject.sidlo?.nazevObce ?? ""}
              maxLength={80}
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            />
          </label>

          {state?.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
          >
            {pending ? "Vytvářím…" : "Vytvořit profil autoškoly"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
