"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type RoleKey =
  | "employer"
  | "instructor"
  | "lecturer_48"
  | "court_interpreter"
  | "other_worker";

const ROLE_OPTIONS: ReadonlyArray<{
  key: RoleKey;
  title: string;
  hint: string;
}> = [
  {
    key: "employer",
    title: "Autoškola",
    hint: "Hledám instruktory, examinátory, lektory a další kolegy.",
  },
  {
    key: "instructor",
    title: "Učitel autoškoly",
    hint: "Učím v autoškole — teorii i praktickou jízdu.",
  },
  {
    key: "lecturer_48",
    title: "Lektor dle § 48",
    hint: "Vedu zákonem stanovená 48hod. školení řidičů.",
  },
  {
    key: "court_interpreter",
    title: "Soudní tlumočník",
    hint: "Tlumočím u zkoušek z odborné způsobilosti.",
  },
  {
    key: "other_worker",
    title: "Jiný pracovník",
    hint: "Admin, zdravotník nebo jiná role v autoškole — upřesníš v profilu.",
  },
];

function nextRoles(current: ReadonlySet<RoleKey>, key: RoleKey): Set<RoleKey> {
  const has = current.has(key);
  if (has) {
    const copy = new Set(current);
    copy.delete(key);
    return copy;
  }
  if (key === "instructor") {
    const copy = new Set<RoleKey>();
    copy.add("instructor");
    if (current.has("lecturer_48")) copy.add("lecturer_48");
    return copy;
  }
  if (key === "lecturer_48") {
    const copy = new Set<RoleKey>();
    copy.add("lecturer_48");
    if (current.has("instructor")) copy.add("instructor");
    return copy;
  }
  return new Set<RoleKey>([key]);
}

function destinationFor(roles: ReadonlySet<RoleKey>): string | null {
  if (roles.size === 0) return null;
  if (roles.has("employer")) return "/onboarding/employer";
  if (roles.has("court_interpreter")) return "/onboarding/court-interpreter";
  if (roles.has("other_worker")) return "/onboarding/other-worker";
  const proRoles: string[] = [];
  if (roles.has("instructor")) proRoles.push("instructor");
  if (roles.has("lecturer_48")) proRoles.push("lecturer_48");
  if (!proRoles.length) return null;
  return `/onboarding/professional?roles=${proRoles.join(",")}`;
}

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [roles, setRoles] = useState<Set<RoleKey>>(new Set());

  function toggle(key: RoleKey) {
    setRoles((prev) => nextRoles(prev, key));
  }

  const isEmployer = roles.has("employer");

  async function onSubmit(formData: FormData) {
    setError(null);
    if (roles.size === 0) {
      setError("Vyber, kdo jsi — jednu možnost (učitel + lektor §48 lze zároveň).");
      return;
    }
    let destination = destinationFor(roles);
    if (!destination) {
      setError("Neplatná kombinace rolí.");
      return;
    }
    if (formData.get("acceptTerms") !== "on") {
      setError("Pro registraci je potřeba souhlasit s podmínkami.");
      return;
    }

    const name = isEmployer
      ? String(formData.get("schoolName") ?? "").trim()
      : String(formData.get("name") ?? "").trim();
    const contactPerson = isEmployer
      ? String(formData.get("contactPerson") ?? "").trim()
      : "";

    if (isEmployer) {
      if (name.length < 2) {
        setError("Vyplň název autoškoly (min. 2 znaky).");
        return;
      }
      if (contactPerson.length < 2) {
        setError("Vyplň kontaktní osobu (min. 2 znaky).");
        return;
      }
      destination = `/onboarding/employer?contact=${encodeURIComponent(contactPerson)}`;
    }

    setPending(true);
    const { error } = await authClient.signUp.email({
      name,
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Registrace selhala.");
      return;
    }
    router.replace(destination);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Kdo jsi <span className="text-[var(--color-accent-500)]">*</span>
        </legend>
        <p className="text-xs text-[var(--color-ink-soft)]">
          Vyber jednu možnost. Učitel autoškoly a lektor § 48 lze zaškrtnout zároveň.
        </p>
        <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ROLE_OPTIONS.map((opt) => {
            const checked = roles.has(opt.key);
            return (
              <label
                key={opt.key}
                className={
                  "flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition " +
                  (checked
                    ? "border-[var(--color-brand-700)] bg-[var(--color-brand-50)]"
                    : "border-[var(--color-line)] bg-[var(--color-paper)] hover:border-[var(--color-brand-700)]")
                }
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-[var(--color-line-strong)] text-[var(--color-brand-700)] focus:ring-2 focus:ring-[var(--color-brand-200)]"
                  checked={checked}
                  onChange={() => toggle(opt.key)}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-[var(--color-ink)]">
                    {opt.title}
                  </span>
                  <span className="text-xs text-[var(--color-ink-muted)]">
                    {opt.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {isEmployer ? (
        <>
          <Field label="Název autoškoly" required>
            <Input
              name="schoolName"
              type="text"
              autoComplete="organization"
              required
              minLength={2}
              placeholder="Autoškola Příklad s.r.o."
            />
          </Field>
          <Field label="Kontaktní osoba" required>
            <Input
              name="contactPerson"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              placeholder="Jméno a příjmení"
            />
          </Field>
        </>
      ) : (
        <Field label="Jméno" required>
          <Input
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
          />
        </Field>
      )}
      <Field label="E-mail" required>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Heslo" required hint="Minimálně 10 znaků.">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
        />
      </Field>
      <label className="flex items-start gap-2.5 text-sm text-[var(--color-ink-muted)]">
        <input
          type="checkbox"
          name="acceptTerms"
          required
          className="mt-0.5 h-4 w-4 rounded border-[var(--color-line-strong)] text-[var(--color-brand-700)] focus:ring-2 focus:ring-[var(--color-brand-200)]"
        />
        <span>
          Souhlasím s{" "}
          <Link
            href="/podminky-pouzivani"
            target="_blank"
            className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
          >
            podmínkami používání
          </Link>{" "}
          a beru na vědomí{" "}
          <Link
            href="/zasady-ochrany-osobnich-udaju"
            target="_blank"
            className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
          >
            zásady ochrany osobních údajů
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p className="rounded-lg bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} size="lg" className="mt-2">
        {pending ? "Registruji…" : "Vytvořit účet"}
      </Button>
    </form>
  );
}
