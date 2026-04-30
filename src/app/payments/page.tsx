import Link from "next/link";
import { requireSession } from "@/lib/auth/server";
import {
  listVisibleProducts,
  getProduct,
  computeListingPublishPriceCzk,
} from "@/lib/payments/products";
import { listPaymentsByUser } from "@/lib/payments/queries";
import { isStripeConfigured } from "@/lib/payments/stripe";
import { isFioConfigured } from "@/lib/payments/fio";
import { PaymentMethodPicker } from "@/components/payments/payment-method-picker";
import { getProfileByUserId } from "@/lib/profiles/queries";
import {
  countPublishedListings,
  getOwnedListing,
} from "@/lib/listings/queries";

export const metadata = {
  title: "Platby",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ listingId?: string }>;
}) {
  const session = await requireSession();
  const sp = await searchParams;
  const myPayments = await listPaymentsByUser(session.user.id);
  const products = listVisibleProducts();
  const stripeAvailable = isStripeConfigured();
  const fioAvailable = isFioConfigured();

  let listingPaymentBlock: {
    listingId: string;
    title: string;
    priceCzk: number;
  } | null = null;
  if (sp.listingId) {
    const profile = await getProfileByUserId(session.user.id);
    if (profile && (profile.type === "employer" || profile.type === "professional")) {
      const owned = await getOwnedListing(sp.listingId, profile.id);
      if (owned) {
        const publishedCount = await countPublishedListings(profile.id);
        const priceCzk = computeListingPublishPriceCzk({
          profileType: profile.type,
          alreadyPublishedCount: publishedCount,
        });
        if (priceCzk > 0) {
          listingPaymentBlock = {
            listingId: sp.listingId,
            title: owned.listing.title,
            priceCzk,
          };
        }
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Platby
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Aktuální nabídka placených funkcí a historie tvých plateb.
      </p>

      {listingPaymentBlock ? (
        <section className="mt-8 rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-6">
          <h2 className="display-xs text-lg text-[var(--color-ink)]">
            Zveřejnit inzerát
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            <span className="font-medium text-[var(--color-ink)]">
              {listingPaymentBlock.title}
            </span>
            {" — "}
            první 3 inzeráty jsi už spotřeboval/a, tento se zveřejní po zaplacení.
          </p>
          <div className="mt-4">
            <PaymentMethodPicker
              product="listing_publish"
              listingId={listingPaymentBlock.listingId}
              productName="Publikace inzerátu"
              priceCzk={listingPaymentBlock.priceCzk}
              stripeAvailable={stripeAvailable}
              fioAvailable={fioAvailable}
            />
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">Nabídka</h2>
        {products.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Aktuálně nejsou žádné placené produkty veřejně dostupné.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <div
                key={p.kind}
                className="flex flex-col gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5"
              >
                <div>
                  <p className="display-xs text-base text-[var(--color-ink)]">
                    {p.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{p.description}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                    {p.priceCzk} Kč
                  </p>
                </div>
                <PaymentMethodPicker
                  product={p.kind}
                  productName={p.name}
                  priceCzk={p.priceCzk}
                  stripeAvailable={stripeAvailable}
                  fioAvailable={fioAvailable}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="display-xs text-lg text-[var(--color-ink)]">Historie plateb</h2>
        {myPayments.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Zatím žádné platby.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {myPayments.map((p) => {
              const product = getProduct(p.product as never);
              return (
                <li
                  key={p.id}
                  className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-ink)]">
                        {product.name}
                      </p>
                      <p className="text-xs text-[var(--color-ink-soft)]">
                        {p.provider === "stripe" ? "Karta" : "Bankovní převod"}
                        {" · "}
                        {new Date(p.createdAt).toLocaleString("cs-CZ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--color-ink)]">
                        {p.amountCzk} Kč
                      </p>
                      <PaymentStatusPill status={p.status} />
                    </div>
                  </div>
                  {p.status === "pending" && p.provider === "fio" ? (
                    <p className="mt-2 text-xs">
                      <Link
                        href={`/payments/fio/${p.id}`}
                        className="font-medium text-[var(--color-ink)] underline"
                      >
                        Zobrazit instrukce k platbě →
                      </Link>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

function PaymentStatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Čeká", cls: "bg-amber-100 text-amber-800" },
    paid: { label: "Zaplaceno", cls: "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]" },
    failed: { label: "Selhalo", cls: "bg-red-100 text-red-800" },
    refunded: { label: "Vráceno", cls: "bg-[var(--color-line)] text-[var(--color-ink-muted)]" },
  };
  const cfg = map[status] ?? { label: status, cls: "bg-[var(--color-canvas-muted)] text-[var(--color-ink-muted)]" };
  return (
    <span
      className={`mt-1 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}
