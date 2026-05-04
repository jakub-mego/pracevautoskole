"use client";

import { useActionState, useState } from "react";
import { setOtherWorkerRoleAction } from "@/app/onboarding/actions";

const CHOICES = [
  { value: "operator_admin", label: "Provozní / administrativa", hint: "Vedu papírování, zápisy, faktury, koordinaci kurzů." },
  { value: "medic", label: "Zdravotník", hint: "Vedu kurzy první pomoci pro žadatele o ŘP." },
  { value: "other", label: "Jiné", hint: "Něco mimo — napiš krátký popis své role." },
] as const;

type Choice = (typeof CHOICES)[number]["value"];

type Props = {
  defaultChoice?: Choice;
  defaultCustomLabel?: string;
  variant?: "onboarding" | "profile";
};

export function OtherWorkerRolePicker({
  defaultChoice,
  defaultCustomLabel,
  variant = "onboarding",
}: Props = {}) {
  const [state, formAction, pending] = useActionState(
    setOtherWorkerRoleAction,
    undefined,
  );
  const [choice, setChoice] = useState<Choice>(defaultChoice ?? "operator_admin");

  const isProfile = variant === "profile";

  return (
    <form
      action={formAction}
      className={
        isProfile
          ? "flex flex-col gap-4"
          : "rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-6"
      }
    >
      {!isProfile ? (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-800)]">
            Doplň svou roli
          </p>
          <h2 className="display-xs mt-2 text-xl text-[var(--color-ink)]">
            Co konkrétně v autoškole děláš?
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Bez konkrétní role se ti nezobrazí matching ani inzeráty.
          </p>
        </>
      ) : null}

      <div className={isProfile ? "grid grid-cols-1 gap-2 sm:grid-cols-3" : "mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3"}>
        {CHOICES.map((opt) => {
          const checked = choice === opt.value;
          return (
            <label
              key={opt.value}
              className={
                "flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition " +
                (checked
                  ? "border-[var(--color-brand-700)] bg-[var(--color-paper)]"
                  : "border-[var(--color-line)] bg-[var(--color-paper)] hover:border-[var(--color-brand-700)]")
              }
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="choice"
                  value={opt.value}
                  checked={checked}
                  onChange={() => setChoice(opt.value)}
                  className="h-4 w-4 text-[var(--color-brand-700)]"
                />
                <span className="text-sm font-semibold text-[var(--color-ink)]">
                  {opt.label}
                </span>
              </span>
              <span className="text-xs text-[var(--color-ink-muted)]">{opt.hint}</span>
            </label>
          );
        })}
      </div>

      {choice === "other" ? (
        <label className={isProfile ? "flex flex-col gap-1" : "mt-4 flex flex-col gap-1"}>
          <span className="text-xs font-medium text-[var(--color-ink-muted)]">
            Popis tvé role
          </span>
          <input
            name="customLabel"
            required
            minLength={2}
            maxLength={80}
            defaultValue={defaultChoice === "other" ? defaultCustomLabel ?? "" : ""}
            placeholder="např. mechanik služebních vozů"
            className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-brand-700)] focus:outline-none"
          />
        </label>
      ) : null}

      {state?.error ? (
        <p className={isProfile ? "text-sm text-[var(--color-danger)]" : "mt-3 text-sm text-[var(--color-danger)]"}>
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className={isProfile ? "text-sm text-[var(--color-brand-700)]" : "mt-3 text-sm text-[var(--color-brand-700)]"}>
          Uloženo.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={
          (isProfile ? "self-start " : "mt-5 ") +
          "rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
        }
      >
        {pending ? "Ukládám…" : isProfile ? "Uložit roli" : "Uložit roli"}
      </button>
    </form>
  );
}
