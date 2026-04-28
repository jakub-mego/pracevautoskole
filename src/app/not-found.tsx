import Link from "next/link";

export const metadata = {
  title: "Stránka nenalezena",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
        Tahle stránka není.
      </h1>
      <p className="mt-3 text-[var(--color-ink-muted)]">
        Možná byla smazaná, nebo jen špatně zadaný odkaz.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)]"
        >
          Na hlavní stránku
        </Link>
        <Link
          href="/inzeraty"
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
        >
          Procházet inzeráty
        </Link>
      </div>
    </main>
  );
}
