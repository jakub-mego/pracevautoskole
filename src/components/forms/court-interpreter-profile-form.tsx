"use client";

import { useActionState } from "react";
import { updateCourtInterpreterProfileAction } from "@/app/profile/actions";

type Defaults = {
  testTranslationPriceCzk: number | null;
  examTranslationPriceCzk: number | null;
  languages: string[];
  cities: string[];
};

export function CourtInterpreterProfileForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState(
    updateCourtInterpreterProfileAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-[var(--color-ink-muted)]">Sazby</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--color-ink-muted)]">Překlad testu (Kč)</span>
            <input
              name="testTranslationPriceCzk"
              type="number"
              min={0}
              step={50}
              inputMode="numeric"
              defaultValue={defaults.testTranslationPriceCzk ?? ""}
              placeholder="např. 800"
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--color-ink-muted)]">Překlad zkoušky v autě (Kč)</span>
            <input
              name="examTranslationPriceCzk"
              type="number"
              min={0}
              step={50}
              inputMode="numeric"
              defaultValue={defaults.examTranslationPriceCzk ?? ""}
              placeholder="např. 1500"
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            />
          </label>
        </div>
        <p className="text-xs text-[var(--color-ink-soft)]">
          Sazby jsou orientační — autoškola si je u tebe potvrdí. Můžeš nechat prázdné.
        </p>
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">
          Nabízené jazyky
        </span>
        <input
          name="languages"
          required
          defaultValue={defaults.languages.join(", ")}
          placeholder="ukrajinština, ruština, angličtina"
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
        <span className="text-xs text-[var(--color-ink-soft)]">Odděl čárkou. Min. 1 jazyk.</span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">
          Města působnosti
        </span>
        <input
          name="cities"
          required
          defaultValue={defaults.cities.join(", ")}
          placeholder="Praha, Kladno, Beroun"
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
        <span className="text-xs text-[var(--color-ink-soft)]">Odděl čárkou. Kde dojíždíš tlumočit.</span>
      </label>

      {state?.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}
      {state?.ok ? (
        <p className="text-sm text-[var(--color-brand-700)]">Uloženo.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
      >
        {pending ? "Ukládám…" : "Uložit sazby a působnost"}
      </button>
    </form>
  );
}
