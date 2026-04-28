"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { withdrawConsentAction } from "@/app/cookies/actions";

export function CookiePreferencesButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  function reset() {
    start(async () => {
      await withdrawConsentAction();
      setDone(true);
      router.refresh();
    });
  }

  if (done) {
    return (
      <span className="text-sm text-[var(--color-brand-700)]">
        Souhlas zrušen. Banner se znovu objeví.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={reset}
      disabled={pending}
      className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)] disabled:opacity-60"
    >
      {pending ? "Ruším…" : "Změnit nastavení cookies"}
    </button>
  );
}
