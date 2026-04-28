"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    await authClient.signOut();
    setPending(false);
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="rounded-full border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)] disabled:opacity-60"
    >
      {pending ? "Odhlašuji…" : "Odhlásit"}
    </button>
  );
}
