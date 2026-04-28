import Link from "next/link";

export const metadata = {
  title: "Platba zrušena",
};

export default function PaymentCancelledPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-20 text-center">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Platba zrušena
      </h1>
      <p className="mt-3 text-[var(--color-ink-muted)]">
        Žádné peníze ti nestrhneme. Pokud jsi narazil/a na problém, dej nám
        prosím vědět.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/payments"
          className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)]"
        >
          Zkusit znovu
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-canvas)]"
        >
          Přehled
        </Link>
      </div>
    </main>
  );
}
