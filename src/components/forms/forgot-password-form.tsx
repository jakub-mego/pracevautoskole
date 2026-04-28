"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const email = String(formData.get("email") ?? "").trim();
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Akce selhala.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-lg border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3 text-sm text-[var(--color-brand-800)]">
          Pokud k zadanému e-mailu existuje účet, poslali jsme odkaz na reset
          hesla. Zkontroluj schránku.
        </p>
        <Link
          href="/sign-in"
          className="text-center text-sm font-medium text-[var(--color-brand-700)] hover:underline"
        >
          ← Zpět na přihlášení
        </Link>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <Field label="E-mail" required>
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      {error ? (
        <p className="rounded-lg bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} size="lg" className="mt-2">
        {pending ? "Odesílám…" : "Poslat odkaz"}
      </Button>
    </form>
  );
}
