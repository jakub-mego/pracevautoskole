import { listAdminUsers } from "@/lib/admin/queries";
import { AdminUserRowActions } from "@/components/admin/admin-user-row-actions";

export default async function AdminUsersPage() {
  const rows = await listAdminUsers();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        Uživatelé ({rows.length})
      </h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
            <tr>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Jméno</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Ověřen</th>
              <th className="px-4 py-3">Vytvořen</th>
              <th className="px-4 py-3">Akce</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-2 font-mono text-xs">{u.email}</td>
                <td className="px-4 py-2">{u.name ?? "—"}</td>
                <td className="px-4 py-2">
                  {u.role === "admin" ? (
                    <span className="rounded bg-[var(--color-ink)] px-1.5 py-0.5 text-xs font-medium text-white">
                      admin
                    </span>
                  ) : (
                    "user"
                  )}
                </td>
                <td className="px-4 py-2">
                  {u.emailVerified ? (
                    <span className="text-emerald-700">✓</span>
                  ) : (
                    <span className="text-amber-700">—</span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs text-[var(--color-ink-soft)]">
                  {new Date(u.createdAt).toLocaleString("cs-CZ")}
                </td>
                <td className="px-4 py-2">
                  <AdminUserRowActions userId={u.id} role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
