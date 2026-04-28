import Link from "next/link";
import { requireSession } from "@/lib/auth/server";
import { getPaymentByIdAndUser } from "@/lib/payments/queries";
import { getProduct } from "@/lib/payments/products";

export const metadata = {
  title: "Platba úspěšná",
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await requireSession();
  const sp = await searchParams;
  const payment = sp.id
    ? await getPaymentByIdAndUser(sp.id, session.user.id)
    : null;

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-20 text-center">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        Děkujeme za platbu
      </h1>
      <p className="mt-3 text-[var(--color-ink-muted)]">
        {payment
          ? `Platba za "${getProduct(payment.product as never).name}" je zpracována. Stav uvidíš v historii.`
          : "Platba je zpracovávána. Stav najdeš v historii plateb."}
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Potvrzení o platbě dostaneš e-mailem.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/payments"
          className="rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)]"
        >
          Historie plateb
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
