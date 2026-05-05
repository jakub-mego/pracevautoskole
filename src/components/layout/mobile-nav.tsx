"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/forms/sign-out-button";

export type MobileNavItem = {
  href: string;
  label: string;
  badge?: number;
};

type MobileNavProps = {
  mainItems: MobileNavItem[];
  userItems: MobileNavItem[];
  isAuthenticated: boolean;
  userEmail?: string;
  showAdmin: boolean;
};

export function MobileNav({
  mainItems,
  userItems,
  isAuthenticated,
  userEmail,
  showAdmin,
}: MobileNavProps) {
  const pathname = usePathname();
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const open = openAtPath === pathname;
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  function setOpen(value: boolean | ((prev: boolean) => boolean)) {
    const next = typeof value === "function" ? value(open) : value;
    setOpenAtPath(next ? pathname : null);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenAtPath(null);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Zavřít menu" : "Otevřít menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-ink)] transition hover:bg-[var(--color-line-soft)]"
      >
        {open ? <CloseIcon /> : <BurgerIcon />}
      </button>

      {open
        ? createPortal(
            <div
              id={panelId}
              className="fixed inset-x-0 top-14 bottom-0 z-40 flex flex-col overflow-hidden bg-[var(--color-paper)]"
              role="dialog"
              aria-modal="true"
              aria-label="Hlavní menu"
            >
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
            {mainItems.map((item) => (
              <MobileNavLink key={item.href} item={item} />
            ))}

            {isAuthenticated ? (
              <>
                <div className="my-3 border-t border-[var(--color-line-soft)]" />
                {userItems.map((item) => (
                  <MobileNavLink key={item.href} item={item} />
                ))}
                {showAdmin ? (
                  <Link
                    href="/admin"
                    className="mt-1 inline-flex items-center justify-between rounded-lg bg-[var(--color-brand-50)] px-3 py-2.5 text-base font-semibold text-[var(--color-brand-800)] transition hover:bg-[var(--color-brand-100)]"
                  >
                    Admin
                  </Link>
                ) : null}
                <div className="mt-auto border-t border-[var(--color-line-soft)] pt-4">
                  {userEmail ? (
                    <p className="px-3 pb-3 text-xs text-[var(--color-ink-soft)]">
                      {userEmail}
                    </p>
                  ) : null}
                  <SignOutButton />
                </div>
              </>
            ) : (
              <div className="mt-auto flex flex-col gap-2 border-t border-[var(--color-line-soft)] pt-4">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--color-line-strong)] px-3 py-2.5 text-base font-medium text-[var(--color-ink)] transition hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)]"
                >
                  Přihlásit
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-lg bg-[var(--color-brand-700)] px-3 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand-800)]"
                >
                  Registrace
                </Link>
              </div>
            )}
              </nav>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function MobileNavLink({ item }: { item: MobileNavItem }) {
  return (
    <Link
      href={item.href}
      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-line-soft)]"
    >
      <span>{item.label}</span>
      {typeof item.badge === "number" ? (
        <span className="rounded-full bg-[var(--color-brand-600)] px-2 py-0.5 text-xs font-semibold leading-none text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

function BurgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="14" x2="17" y2="14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="5" y1="5" x2="15" y2="15" />
      <line x1="15" y1="5" x2="5" y2="15" />
    </svg>
  );
}
