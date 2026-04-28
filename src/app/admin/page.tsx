import { getAdminStats } from "@/lib/admin/queries";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const cards = [
    { label: "Uživatelé", value: stats.users, hint: `${stats.unverified} neověřených` },
    { label: "Aktivní inzeráty", value: stats.listingsActive },
    { label: "Otevřené reporty", value: stats.reportsOpen },
    {
      label: "Verifikace průkazů",
      value: stats.pendingCredentials,
      hint: "ke schválení",
    },
    { label: "Platby (zaplaceno)", value: stats.paymentsPaid },
    { label: "Tržby (Kč)", value: stats.revenueCzk.toLocaleString("cs-CZ") },
  ];
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        Přehled
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5"
          >
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-ink)]">
              {c.value}
            </p>
            {c.hint ? (
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{c.hint}</p>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
