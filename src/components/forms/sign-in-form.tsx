"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const { error } = await authClient.signIn.email({
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Přihlášení selhalo.");
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <Field label="E-mail" required>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Heslo" required>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={10}
        />
      </Field>
      {error ? (
        <p className="rounded-lg bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} size="lg" className="mt-2">
        {pending ? "Přihlašuji…" : "Přihlásit se"}
      </Button>
      <div className="text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-[var(--color-ink-muted)] hover:text-[var(--color-brand-700)] hover:underline"
        >
          Zapomenuté heslo?
        </Link>
      </div>
    </form>
  );
}
