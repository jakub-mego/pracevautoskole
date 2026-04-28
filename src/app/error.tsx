"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-danger)]">
        Něco se pokazilo
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
        Tudy cesta nevede.
      </h1>
      <p className="mt-3 text-[var(--color-ink-muted)]">
        Vznikla neočekávaná chyba. Zkus stránku načíst znovu — pokud se chyba
        opakuje, dej nám prosím vědět.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-[var(--color-ink-soft)]">
          Ref: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)]"
        >
          Zkusit znovu
        </button>
        <a
          href="/"
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
        >
          Na hlavní stránku
        </a>
      </div>
    </main>
  );
}
