"use client";

import { useActionState } from "react";
import {
  createListingAction,
  updateListingAction,
  type FormActionState,
} from "@/app/listings/actions";
import {
  PROFESSIONAL_ROLE_LABELS,
  LICENSE_CATEGORIES,
} from "@/lib/profiles/labels";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/listings/labels";

type Defaults = {
  title?: string;
  description?: string;
  region?: string | null;
  city?: string | null;
  postalCode?: string | null;
  remoteFriendly?: number | null;
  travelRadiusKm?: number | null;
  rateTheoryMin?: number | null;
  rateTheoryMax?: number | null;
  ratePracticeMin?: number | null;
  ratePracticeMax?: number | null;
  rateHealthMin?: number | null;
  rateHealthMax?: number | null;
  employmentType?: string | null;
  startAvailability?: string | null;
  roles?: string[];
  licenses?: string[];
  coursePriceCzk?: number | null;
  courseStartDate?: Date | string | null;
  courseDurationHours?: number | null;
};

type Intent = "employer_seeks" | "professional_seeks" | "employer_course";

type Props = {
  mode: "create" | "edit";
  listingId?: string;
  defaults?: Defaults;
  intent: Intent;
};

const TEXTS: Record<Intent, {
  formTitle: string;
  titlePh: string;
  descPh: string;
  rolesLegend: string;
}> = {
  employer_seeks: {
    formTitle: "Inzerát: hledáme do týmu",
    titlePh: "Hledáme učitele autoškoly s ŘP B",
    descPh:
      "O autoškole, regionu, jak vypadá běžný den, co očekáváte, co nabízíte (kromě sazby).",
    rolesLegend: "Koho hledáte (alespoň jedno)",
  },
  professional_seeks: {
    formTitle: "Inzerát: hledám práci",
    titlePh: "Učitel s ŘP B+C, 8 let praxe, hledám místo Praha+",
    descPh: "Tvoje praxe, na čem ti záleží, jak rád pracuješ, co rád neděláš.",
    rolesLegend: "V čem nabízíš sebe (alespoň jedno)",
  },
  employer_course: {
    formTitle: "Inzerát: kurz pro budoucí učitele autoškoly",
    titlePh: "Kurz pro učitele autoškoly — Praha, jaro 2026",
    descPh:
      "Co se účastník naučí, kdo jsou lektoři, kde výuka probíhá, co je v ceně, jak se přihlásit.",
    rolesLegend: "",
  },
};

function dateToInputValue(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function intToBool(v?: number | null) {
  return v ? 1 : 0;
}

export function ListingForm({ mode, listingId, defaults, intent }: Props) {
  const action =
    mode === "create"
      ? createListingAction
      : (prev: FormActionState, formData: FormData) =>
          updateListingAction(listingId!, prev, formData);

  const [state, formAction, pending] = useActionState(action, undefined);
  const t = TEXTS[intent];
  const remoteOn = intToBool(defaults?.remoteFriendly) === 1;
  const selectedRoles = new Set(defaults?.roles ?? []);
  const selectedLicenses = new Set(defaults?.licenses ?? []);
  const isCourse = intent === "employer_course";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input
        type="hidden"
        name="intent"
        value={isCourse ? "course" : "job"}
      />
      <header>
        <h2 className="display-xs text-lg text-[var(--color-ink)]">{t.formTitle}</h2>
        {isCourse ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Zveřejnění kurzu = jednorázový poplatek <strong>999 Kč</strong>{" "}
            (žádná free quota). Inzerát aktivní 90 dní.
          </p>
        ) : null}
      </header>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">Titulek</span>
        <input
          name="title"
          required
          minLength={5}
          maxLength={140}
          defaultValue={defaults?.title}
          placeholder={t.titlePh}
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-muted)]">Popis</span>
        <textarea
          name="description"
          required
          minLength={20}
          maxLength={8000}
          rows={8}
          defaultValue={defaults?.description}
          placeholder={t.descPh}
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
      </label>

      {isCourse ? null : (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-[var(--color-ink-muted)]">
            {t.rolesLegend}
          </legend>
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
      )}

      {isCourse ? (
        <fieldset className="grid grid-cols-1 gap-4 rounded-lg border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-4 sm:grid-cols-3">
          <legend className="text-sm font-medium text-[var(--color-ink-muted)]">
            Detaily kurzu
          </legend>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-ink-muted)]">
              Cena pro účastníka (Kč)
            </span>
            <input
              name="coursePriceCzk"
              type="number"
              inputMode="numeric"
              min={0}
              max={500000}
              step={100}
              defaultValue={defaults?.coursePriceCzk ?? ""}
              placeholder="např. 25000"
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-ink-muted)]">
              Datum zahájení
            </span>
            <input
              name="courseStartDate"
              type="date"
              defaultValue={dateToInputValue(defaults?.courseStartDate)}
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-ink-muted)]">
              Délka (hodin)
            </span>
            <input
              name="courseDurationHours"
              type="number"
              inputMode="numeric"
              min={1}
              max={1000}
              defaultValue={defaults?.courseDurationHours ?? ""}
              placeholder="např. 80"
              className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
            />
          </label>
        </fieldset>
      ) : null}

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
            defaultValue={defaults?.region ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Město</span>
          <input
            name="city"
            maxLength={80}
            defaultValue={defaults?.city ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">PSČ</span>
          <input
            name="postalCode"
            maxLength={10}
            defaultValue={defaults?.postalCode ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
          <input
            type="checkbox"
            name="remoteFriendly"
            defaultChecked={remoteOn}
          />
          Lze i online (typicky teorie)
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Dojezd (km)</span>
          <input
            name="travelRadiusKm"
            inputMode="numeric"
            type="number"
            min={0}
            max={500}
            defaultValue={defaults?.travelRadiusKm ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Forma spolupráce</span>
          <select
            name="employmentType"
            defaultValue={defaults?.employmentType ?? ""}
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          >
            <option value="">— neuvedeno —</option>
            {EMPLOYMENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">Nástup / dostupnost</span>
          <input
            name="startAvailability"
            maxLength={120}
            defaultValue={defaults?.startAvailability ?? ""}
            placeholder="ihned / od května / domluva"
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      </div>

      {isCourse ? null : (
        <fieldset className="grid grid-cols-1 gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-canvas)] p-4 sm:grid-cols-3">
          <legend className="text-sm font-medium text-[var(--color-ink-muted)]">
            Sazby Kč / 45 min (volitelné)
          </legend>
          <RatePair
            label="Teorie"
            minName="rateTheoryMin"
            maxName="rateTheoryMax"
            minDefault={defaults?.rateTheoryMin}
            maxDefault={defaults?.rateTheoryMax}
          />
          <RatePair
            label="Praxe"
            minName="ratePracticeMin"
            maxName="ratePracticeMax"
            minDefault={defaults?.ratePracticeMin}
            maxDefault={defaults?.ratePracticeMax}
          />
          <RatePair
            label="Zdravotní"
            minName="rateHealthMin"
            maxName="rateHealthMax"
            minDefault={defaults?.rateHealthMin}
            maxDefault={defaults?.rateHealthMax}
          />
        </fieldset>
      )}

      {state?.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}
      {mode === "edit" && state && !state.error ? (
        <p className="text-sm text-[var(--color-brand-700)]">Uloženo.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
      >
        {pending
          ? "Ukládám…"
          : mode === "create"
            ? "Vytvořit jako koncept"
            : "Uložit změny"}
      </button>
    </form>
  );
}

function RatePair({
  label,
  minName,
  maxName,
  minDefault,
  maxDefault,
}: {
  label: string;
  minName: string;
  maxName: string;
  minDefault?: number | null;
  maxDefault?: number | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[var(--color-ink-muted)]">{label}</span>
      <div className="flex gap-1">
        <input
          name={minName}
          type="number"
          inputMode="numeric"
          min={0}
          max={100000}
          defaultValue={minDefault ?? ""}
          placeholder="od"
          className="w-full rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-1.5 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
        <input
          name={maxName}
          type="number"
          inputMode="numeric"
          min={0}
          max={100000}
          defaultValue={maxDefault ?? ""}
          placeholder="do"
          className="w-full rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-1.5 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
        />
      </div>
    </div>
  );
}
