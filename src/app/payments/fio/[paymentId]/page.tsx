import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getPaymentByIdAndUser } from "@/lib/payments/queries";
import { getProduct } from "@/lib/payments/products";
import { getFioInstructions } from "@/lib/payments/fio";

export const metadata = {
  title: "Pokyny k bankovnímu převodu",
};

export default async function FioPaymentDetailPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const session = await requireSession();
  const { paymentId } = await params;
  const payment = await getPaymentByIdAndUser(paymentId, session.user.id);
  if (!payment) notFound();
  if (payment.provider !== "fio") notFound();

  const product = getProduct(payment.product as never);
  const instructions = getFioInstructions({
    amountCzk: payment.amountCzk,
    variableSymbol: payment.variableSymbol ?? "",
    message: `${product.name} (#${payment.id.slice(0, 8)})`,
  });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Pokyny k bankovnímu převodu
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Zaplať na účet níže s uvedeným variabilním symbolem. Po zaúčtování
        v Fio bance (typicky během 1 pracovního dne) se status automaticky
        změní.
      </p>

      {payment.status === "paid" ? (
        <p className="mt-6 rounded-md border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3 text-sm text-[var(--color-brand-900)]">
          Platba je už zaplacená. Můžeš pokračovat.
        </p>
      ) : null}

      <dl className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            Číslo účtu (CZ)
          </dt>
          <dd className="mt-1 font-mono text-base text-[var(--color-ink)]">
            {instructions.accountNumberCz}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            Částka
          </dt>
          <dd className="mt-1 font-mono text-base text-[var(--color-ink)]">
            {instructions.amountCzk} Kč
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            Variabilní symbol
          </dt>
          <dd className="mt-1 font-mono text-base font-semibold text-[var(--color-ink)]">
            {instructions.variableSymbol}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            Zpráva pro příjemce
          </dt>
          <dd className="mt-1 text-base text-[var(--color-ink)]">{instructions.message}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            IBAN / BIC (zahraniční převod)
          </dt>
          <dd className="mt-1 font-mono text-sm text-[var(--color-ink-muted)]">
            {instructions.iban} · {instructions.bic}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
        Po připsání platby ti pošleme potvrzení e-mailem a status v{" "}
        <Link href="/payments" className="font-medium text-[var(--color-ink)] underline">
          historii plateb
        </Link>{" "}
        se změní na „Zaplaceno".
      </p>
    </main>
  );
}
