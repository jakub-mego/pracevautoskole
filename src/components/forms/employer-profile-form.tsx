"use client";

import { useActionState } from "react";
import { updateEmployerProfileAction } from "@/app/profile/actions";

type Defaults = {
  displayName: string;
  about: string | null;
  region: string | null;
  city: string | null;
  postalCode: string | null;
  publicEmail: string | null;
  phone: string | null;
  website: string | null;
  legalName: string;
  ico: string;
};

export function EmployerProfileForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState(
    updateEmployerProfileAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <section className="rounded-lg border border-[var(--color-line)] bg-[var(--color-canvas)] p-4 text-sm text-[var(--color-ink-muted)]">
        <p>
          <span className="font-medium text-[var(--color-ink)]">{defaults.legalName}</span>
          <span className="mx-2 text-[var(--color-ink-soft)]">·</span>
          IČO {defaults.ico}
        </p>
        <p className="text-xs text-[var(--color-ink-soft)]">Načteno z ARES, neměnitelné.</p>
      </section>

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
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">O autoškole</span>
        <textarea
          name="about"
          maxLength={2000}
          rows={5}
          defaultValue={defaults.about ?? ""}
          placeholder="Krátký popis: kdy jste vznikli, lokality, čím se odlišujete."
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
      </label>

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
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Web</span>
          <input
            name="website"
            type="url"
            maxLength={200}
            defaultValue={defaults.website ?? ""}
            placeholder="https://"
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      </fieldset>

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
