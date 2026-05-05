import Link from "next/link";
import { getSession, getCurrentUserRole } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { countUnreadForProfile } from "@/lib/messaging/queries";
import { SignOutButton } from "@/components/forms/sign-out-button";
import { MobileNav, type MobileNavItem } from "./mobile-nav";

export async function SiteHeader() {
  const session = await getSession();
  const role = session ? await getCurrentUserRole() : null;
  const profile = session ? await getProfileByUserId(session.user.id) : null;
  const unread = profile ? await countUnreadForProfile(profile.id) : 0;

  const mainItems: MobileNavItem[] = [
    { href: "/inzeraty", label: "Inzeráty" },
    { href: "/kurzy-pro-ucitele", label: "Kurzy pro učitele" },
    { href: "/cenik", label: "Ceník" },
    { href: "/profese", label: "Profese a města" },
  ];

  const userItems: MobileNavItem[] = session
    ? [
        { href: "/listings", label: "Moje inzeráty" },
        { href: "/zpravy", label: "Zprávy", badge: unread > 0 ? unread : undefined },
        { href: "/profile", label: "Profil" },
        { href: "/dashboard", label: "Přehled" },
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-line-soft)] bg-[var(--color-paper)]/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-semibold tracking-tight text-[var(--color-ink)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-500)] opacity-50 transition group-hover:opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand-600)]" />
          </span>
          pracevautoskole.cz
        </Link>

        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {mainItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          {session ? (
            <>
              {userItems.map((item) => (
                <NavLink key={item.href} href={item.href} badge={item.badge}>
                  {item.label}
                </NavLink>
              ))}
              {role === "admin" ? (
                <Link
                  href="/admin"
                  className="ml-1 inline-flex items-center rounded-md bg-[var(--color-brand-50)] px-2 py-1 text-xs font-semibold text-[var(--color-brand-800)] transition hover:bg-[var(--color-brand-100)]"
                >
                  Admin
                </Link>
              ) : null}
              <span className="hidden pl-2 text-xs text-[var(--color-ink-soft)] xl:inline">
                {session.user.email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
              >
                Přihlásit
              </Link>
              <Link
                href="/sign-up"
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-700)] px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand-800)]"
              >
                Registrace
              </Link>
            </>
          )}
        </nav>

        <div className="lg:hidden">
          <MobileNav
            mainItems={mainItems}
            userItems={userItems}
            isAuthenticated={Boolean(session)}
            userEmail={session?.user.email}
            showAdmin={role === "admin"}
          />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  badge,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] transition hover:bg-[var(--color-line-soft)] hover:text-[var(--color-ink)]"
    >
      {children}
      {typeof badge === "number" ? (
        <span className="rounded-full bg-[var(--color-brand-600)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
