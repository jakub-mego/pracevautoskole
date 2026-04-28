"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    if (formData.get("acceptTerms") !== "on") {
      setError("Pro registraci je potřeba souhlasit s podmínkami.");
      return;
    }
    setPending(true);
    const { error } = await authClient.signUp.email({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Registrace selhala.");
      return;
    }
    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <Field label="Jméno" required>
        <Input
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
        />
      </Field>
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
