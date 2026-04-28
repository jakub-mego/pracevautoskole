"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    if (password !== confirm) {
      setError("Hesla se neshodují.");
      return;
    }
    if (password.length < 10) {
      setError("Heslo musí mít alespoň 10 znaků.");
      return;
    }
    setPending(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Reset selhal. Zkus si vyžádat nový odkaz.");
      return;
    }
    router.replace("/sign-in?reset=ok");
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <Field label="Nové heslo" required hint="Min. 10 znaků.">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
        />
      </Field>
      <Field label="Heslo znovu" required>
        <Input
          name="confirm"
          type="password"
          autoComplete="new-password"
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
        {pending ? "Ukládám…" : "Nastavit heslo"}
      </Button>
    </form>
  );
}
