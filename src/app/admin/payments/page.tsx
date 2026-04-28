import { listAdminPayments } from "@/lib/admin/queries";
import { getProduct } from "@/lib/payments/products";

const STATUS_CLS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-[var(--color-brand-100)] text-emerald-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-[var(--color-line)] text-[var(--color-ink-muted)]",
};

export default async function AdminPaymentsPage() {
  const rows = await listAdminPayments();
  const totalPaid = rows
    .filter((r) => r.payment.status === "paid")
    .reduce((s, r) => s + r.payment.amountCzk, 0);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        Platby ({rows.length})
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        Tržby (zaplaceno):{" "}
        <span className="font-semibold text-[var(--color-ink)]">
          {totalPaid.toLocaleString("cs-CZ")} Kč
        </span>
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
            <tr>
              <th className="px-4 py-3">Doklad #</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Uživatel</th>
              <th className="px-4 py-3">Produkt</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Částka</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">VS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ payment, userEmail }) => {
              const product = getProduct(payment.product as never);
              return (
                <tr
                  key={payment.id}
                  className="border-b border-zinc-100 last:border-0"
                >
                  <td className="px-4 py-2 font-mono text-xs">
                    {payment.receiptNumber ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-xs text-[var(--color-ink-muted)]">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleString("cs-CZ")
                      : new Date(payment.createdAt).toLocaleString("cs-CZ")}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {userEmail ?? (
                      <span className="text-[var(--color-ink-soft)]" title="Anonymizovaný účet">
                        smazaný účet
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2 text-xs text-[var(--color-ink-muted)]">
                    {payment.provider === "stripe" ? "Karta" : "Převod"}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {payment.amountCzk} Kč
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        STATUS_CLS[payment.status]
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {payment.variableSymbol ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
