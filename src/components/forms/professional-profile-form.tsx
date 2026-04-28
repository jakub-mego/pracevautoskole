"use client";

import { useActionState } from "react";
import { updateProfessionalProfileAction } from "@/app/profile/actions";
import {
  PROFESSIONAL_ROLE_LABELS,
  LICENSE_CATEGORIES,
} from "@/lib/profiles/labels";

type Defaults = {
  displayName: string;
  about: string | null;
  region: string | null;
  city: string | null;
  postalCode: string | null;
  publicEmail: string | null;
  phone: string | null;
  anonymous: boolean;
  activelySeeking: boolean;
  roles: string[];
  licenses: string[];
};

export function ProfessionalProfileForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState(
    updateProfessionalProfileAction,
    undefined,
  );
  const selectedRoles = new Set(defaults.roles);
  const selectedLicenses = new Set(defaults.licenses);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">Zobrazované jméno</span>
        <input
          name="displayName"
          required
          minLength={2}
          maxLength={120}
          defaultValue={defaults.displayName}
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">O mně</span>
        <textarea
          name="about"
          maxLength={2000}
          rows={5}
          defaultValue={defaults.about ?? ""}
          placeholder="Praxe, jazyky, čím se odlišuješ, na čem ti záleží."
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-[var(--color-ink-muted)]">Co děláš</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(PROFESSIONAL_ROLE_LABELS).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
              <input
                type="checkbox"
                name="roles"
                value={value}
                defaultChecked={selectedRoles.has(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-[var(--color-ink-muted)]">Skupiny ŘP</legend>
        <div className="flex flex-wrap gap-2">
          {LICENSE_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-1 rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2.5 py-1 text-sm text-[var(--color-ink)]"
            >
              <input
                type="checkbox"
                name="licenses"
                value={cat}
                defaultChecked={selectedLicenses.has(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Kraj</span>
          <input
            name="region"
            maxLength={80}
            defaultValue={defaults.region ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Město</span>
          <input
            name="city"
            maxLength={80}
            defaultValue={defaults.city ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">PSČ</span>
          <input
            name="postalCode"
            maxLength={10}
            defaultValue={defaults.postalCode ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      </div>

      <fieldset className="grid grid-cols-1 gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4 sm:grid-cols-2">
        <legend className="text-sm font-medium text-[var(--color-ink-muted)]">
          Kontakt (zobrazí se přihlášeným uživatelům)
        </legend>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Veřejný e-mail</span>
          <input
            name="publicEmail"
            type="email"
            maxLength={120}
            defaultValue={defaults.publicEmail ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Telefon</span>
          <input
            name="phone"
            maxLength={40}
            defaultValue={defaults.phone ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
          <input
            type="checkbox"
            name="activelySeeking"
            defaultChecked={defaults.activelySeeking}
          />
          Aktivně hledám místo (zvýší viditelnost)
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
          <input
            type="checkbox"
            name="anonymous"
            defaultChecked={defaults.anonymous}
          />
          Anonymní profil (jméno se zobrazí až po kontaktu)
        </label>
      </div>

      {state?.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}
      {state?.ok ? <p className="text-sm text-[var(--color-brand-700)]">Uloženo.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
      >
        {pending ? "Ukládám…" : "Uložit profil"}
      </button>
    </form>
  );
}
