"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveConsentAction } from "@/app/cookies/actions";

export function CookieBannerClient() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [hidden, setHidden] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  function commit(analytics: boolean, marketing: boolean) {
    setHidden(true);
    start(async () => {
      await saveConsentAction({ analytics, marketing });
      router.refresh();
    });
  }

  if (hidden) return null;

  return (
    <div
      role="dialog"
      aria-label="Souhlas s cookies"
      className="fixed inset-x-0 bottom-4 z-50 mx-4 sm:bottom-6 sm:mx-auto sm:max-w-3xl"
    >
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 shadow-[var(--shadow-elevated)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-sm text-[var(--color-ink-muted)]">
            <p className="text-sm font-semibold text-[var(--color-ink)]">Cookies</p>
            <p className="mt-1">
              Používáme nezbytné cookies pro chod aplikace. Volitelně bychom
              rádi měřili návštěvnost (analytika), abychom web zlepšovali.
              Detaily v{" "}
              <Link
                href="/cookies"
                className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
              >
                zásadách cookies
              </Link>
              .
            </p>
            {showDetails ? (
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-ink-soft)]">
                <li>
                  <strong className="text-[var(--color-ink-muted)]">Nezbytné</strong> — vždy aktivní (přihlášení, CSRF).
                </li>
                <li>
                  <strong className="text-[var(--color-ink-muted)]">Analytické</strong> — anonymizovaná návštěvnost.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-muted)]">Marketing</strong> — neaktivní (zatím nepoužíváme).
                </li>
              </ul>
            ) : (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="mt-1 text-xs text-[var(--color-ink-soft)] underline-offset-2 hover:text-[var(--color-ink)] hover:underline"
              >
                Co konkrétně?
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <button
              type="button"
              onClick={() => commit(false, false)}
              disabled={pending}
              className="rounded-full border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)] disabled:opacity-60"
            >
              Jen nezbytné
            </button>
            <button
              type="button"
              onClick={() => commit(true, false)}
              disabled={pending}
              className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-canvas)] transition hover:bg-[var(--color-brand-900)] disabled:opacity-60"
            >
              Přijmout vše
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
