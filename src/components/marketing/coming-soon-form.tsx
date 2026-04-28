"use client";

import { useActionState } from "react";
import { unlockComingSoonAction } from "@/app/coming-soon/actions";

export function ComingSoonForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(
    unlockComingSoonAction,
    undefined,
  );

  return (
    <div className="w-full">
      <form action={formAction} className="relative">
        <input type="hidden" name="from" value={from} />
        <input
          name="password"
          type="password"
          autoComplete="off"
          autoFocus
          required
          placeholder="Heslo pro preview přístup"
          aria-label="Přístupové heslo"
          className="w-full rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] py-4 pl-6 pr-36 text-base text-[var(--color-ink)] shadow-[0_8px_32px_-12px_rgba(2,44,34,0.18)] outline-none transition placeholder:text-[var(--color-ink-soft)]/70 focus:border-[var(--color-brand-600)] focus:ring-4 focus:ring-[var(--color-brand-100)] sm:text-lg"
        />
        <button
          type="submit"
          disabled={pending}
          className="group absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-[var(--color-brand-700)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-800)] disabled:opacity-60 sm:px-6"
        >
          {pending ? "Ověřuji…" : "Vstoupit"}
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="transition group-hover:translate-x-0.5"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </form>
      {state?.error ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-danger-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-danger)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
