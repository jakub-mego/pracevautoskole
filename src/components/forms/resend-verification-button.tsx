"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function ResendVerificationButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "pending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onClick() {
    setState("pending");
    setMessage(null);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/sign-in?verified=ok",
    });
    if (error) {
      setState("error");
      setMessage(error.message ?? "Odeslání selhalo.");
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <span className="text-sm font-medium text-[var(--color-brand-700)]">
        Odkaz odeslán. Zkontroluj schránku.
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={state === "pending"}
        className="rounded-full border border-[var(--color-warning-fg)]/30 bg-[var(--color-paper)] px-3 py-1 text-sm font-medium text-[var(--color-warning-fg)] transition hover:bg-[var(--color-warning-bg)] disabled:opacity-60"
      >
        {state === "pending" ? "Odesílám…" : "Poslat ověřovací odkaz"}
      </button>
      {message ? <span className="text-sm text-[var(--color-danger)]">{message}</span> : null}
    </span>
  );
}
