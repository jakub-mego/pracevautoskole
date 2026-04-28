import Link from "next/link";
import { requireAdmin } from "@/lib/auth/server";

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8">
      <aside className="w-48 shrink-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
          Admin
        </p>
        <nav className="mt-3 flex flex-col gap-1 text-sm">
          <Link href="/admin" className="rounded-md px-2 py-1 hover:bg-[var(--color-canvas-muted)]">
            Přehled
          </Link>
          <Link
            href="/admin/users"
            className="rounded-md px-2 py-1 hover:bg-[var(--color-canvas-muted)]"
          >
            Uživatelé
          </Link>
          <Link
            href="/admin/listings"
            className="rounded-md px-2 py-1 hover:bg-[var(--color-canvas-muted)]"
          >
            Inzeráty
          </Link>
          <Link
            href="/admin/verifikace"
            className="rounded-md px-2 py-1 hover:bg-[var(--color-canvas-muted)]"
          >
            Verifikace
          </Link>
          <Link
            href="/admin/reports"
            className="rounded-md px-2 py-1 hover:bg-[var(--color-canvas-muted)]"
          >
            Reporty
          </Link>
          <Link
            href="/admin/payments"
            className="rounded-md px-2 py-1 hover:bg-[var(--color-canvas-muted)]"
          >
            Platby
          </Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
