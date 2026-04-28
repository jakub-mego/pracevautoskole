"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  startStripeCheckoutAction,
  startFioPaymentAction,
} from "@/app/payments/actions";
import type { ProductKind } from "@/lib/payments/products";

type Method = "stripe" | "fio";

export function PaymentMethodPicker({
  product,
  listingId,
  productName,
  priceCzk,
  stripeAvailable,
  fioAvailable,
}: {
  product: ProductKind;
  listingId?: string;
  productName: string;
  priceCzk: number;
  stripeAvailable: boolean;
  fioAvailable: boolean;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<Method>(stripeAvailable ? "stripe" : "fio");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (!stripeAvailable && !fioAvailable) {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Platby zatím nejsou nakonfigurované (chybí Stripe / Fio).
      </p>
    );
  }

  function pay() {
    setError(null);
    start(async () => {
      if (method === "stripe") {
        const result = await startStripeCheckoutAction({ product, listingId });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        window.location.href = result.url;
      } else {
        const result = await startFioPaymentAction({ product, listingId });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.push(`/payments/fio/${result.paymentId}`);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
      <p className="text-sm text-[var(--color-ink-muted)]">
        <span className="font-medium text-[var(--color-ink)]">{productName}</span>
        {" — "}
        <span className="font-semibold">{priceCzk} Kč</span>
      </p>

      <fieldset className="flex flex-col gap-2 text-sm text-[var(--color-ink)]">
        {stripeAvailable && (
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="stripe"
              checked={method === "stripe"}
              onChange={() => setMethod("stripe")}
            />
            Platba kartou (Stripe)
          </label>
        )}
        {fioAvailable && (
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="fio"
              checked={method === "fio"}
              onChange={() => setMethod("fio")}
            />
            Bankovní převod (Fio) — instrukce přijdou v dalším kroku
          </label>
        )}
      </fieldset>

      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}

      <button
        type="button"
        onClick={pay}
        disabled={pending}
        className="self-start rounded-md bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-900)] disabled:opacity-60"
      >
        {pending ? "Pokračuji…" : "Pokračovat k platbě"}
      </button>
    </div>
  );
}
