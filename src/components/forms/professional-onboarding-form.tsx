"use client";

import { useActionState } from "react";
import { createProfessionalProfileAction } from "@/app/onboarding/actions";
import {
  PROFESSIONAL_ROLE_LABELS,
  type ProfessionalRoleKey,
  LICENSE_CATEGORIES,
} from "@/lib/profiles/labels";

type Props = {
  defaultRoles?: ProfessionalRoleKey[];
};

export function ProfessionalOnboardingForm({ defaultRoles }: Props = {}) {
  const [state, formAction, pending] = useActionState(
    createProfessionalProfileAction,
    undefined,
  );

  const lockedRoles = defaultRoles && defaultRoles.length > 0 ? defaultRoles : null;

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

      {lockedRoles ? (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Tvoje role</span>
          <div className="flex flex-wrap gap-2">
            {lockedRoles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-[var(--color-brand-700)] bg-[var(--color-brand-50)] px-3 py-1 text-xs font-medium text-[var(--color-brand-800)]"
              >
                {PROFESSIONAL_ROLE_LABELS[role]}
              </span>
            ))}
          </div>
          {lockedRoles.map((role) => (
            <input key={role} type="hidden" name="roles" value={role} />
          ))}
          <p className="text-xs text-[var(--color-ink-soft)]">
            Další role půjde přidat později v profilu.
          </p>
        </div>
      ) : (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-[var(--color-ink-muted)]">
            Co děláš (vyber alespoň jedno)
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Object.entries(PROFESSIONAL_ROLE_LABELS).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                <input type="checkbox" name="roles" value={value} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-[var(--color-ink-muted)]">
          Skupiny ŘP, které učíš (volitelné)
        </legend>
        <div className="flex flex-wrap gap-2">
          {LICENSE_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-1 rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2.5 py-1 text-sm text-[var(--color-ink)]"
            >
              <input type="checkbox" name="licenses" value={cat} />
              {cat}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
        <input type="checkbox" name="anonymous" />
        Zobrazovat profil anonymně (jméno se zobrazí jen po kontaktu)
      </label>

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
