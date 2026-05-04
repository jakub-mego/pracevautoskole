"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveConsentAction } from "@/app/cookies/actions";

type Mode = "summary" | "custom";

export function CookieBannerClient() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [hidden, setHidden] = useState(false);
  const [mode, setMode] = useState<Mode>("summary");
  const [analytics, setAnalytics] = useState(false);

  function commit(values: { analytics: boolean; marketing: boolean }) {
    setHidden(true);
    start(async () => {
      await saveConsentAction(values);
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
        {mode === "summary" ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-sm text-[var(--color-ink-muted)]">
              <p className="text-sm font-semibold text-[var(--color-ink)]">Cookies</p>
              <p className="mt-1">
                Používáme nezbytné cookies pro chod aplikace. Volitelně bychom
                rádi měřili návštěvnost (Google Analytics 4, anonymizovaně), abychom web
                zlepšovali. Detaily v{" "}
                <Link
                  href="/cookies"
                  className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
                >
                  zásadách cookies
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
              <button
                type="button"
                onClick={() => commit({ analytics: false, marketing: false })}
                disabled={pending}
                className="rounded-full border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)] disabled:opacity-60"
              >
                Odmítnout vše
              </button>
              <button
                type="button"
                onClick={() => setMode("custom")}
                disabled={pending}
                className="rounded-full border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)] disabled:opacity-60"
              >
                Nastavit
              </button>
              <button
                type="button"
                onClick={() => commit({ analytics: true, marketing: false })}
                disabled={pending}
                className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-canvas)] transition hover:bg-[var(--color-brand-900)] disabled:opacity-60"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                Vlastní nastavení cookies
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                Zvol, co povolíš. Detaily v{" "}
                <Link
                  href="/cookies"
                  className="font-medium text-[var(--color-brand-700)] underline-offset-2 hover:underline"
                >
                  zásadách cookies
                </Link>
                .
              </p>
            </div>

            <ul className="flex flex-col divide-y divide-[var(--color-line)]">
              <li className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    Nezbytné
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                    Přihlášení, CSRF ochrana, uložení tvé volby cookies. Bez
                    nich se aplikace nedá používat.
                  </p>
                </div>
                <span className="text-xs font-medium text-[var(--color-ink-soft)]">
                  Vždy aktivní
                </span>
              </li>
              <li className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    Analytické
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                    Google Analytics 4 — anonymizovaná návštěvnost, žádný
                    cross-site tracking.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <span className="relative inline-block h-6 w-11 rounded-full bg-[var(--color-line-strong)] transition peer-checked:bg-[var(--color-brand-700)]">
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </span>
                </label>
              </li>
              <li className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    Marketingové
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                    Aktuálně nepoužíváme — žádná reklamní síť není napojená.
                  </p>
                </div>
                <span className="text-xs font-medium text-[var(--color-ink-soft)]">
                  Neaktivní
                </span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMode("summary")}
                disabled={pending}
                className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:underline"
              >
                ← Zpět
              </button>
              <button
                type="button"
                onClick={() => commit({ analytics, marketing: false })}
                disabled={pending}
                className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-canvas)] transition hover:bg-[var(--color-brand-900)] disabled:opacity-60"
              >
                Uložit moji volbu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
