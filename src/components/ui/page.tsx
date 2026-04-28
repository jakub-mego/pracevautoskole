import { type ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

/**
 * Standardní app-page header — eyebrow + serif display nadpis + popis.
 * Používaj na všech vnitřních stránkách (dashboard, profil, listings, ...).
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`flex flex-wrap items-end justify-between gap-6 ${className}`.trim()}
    >
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="display-md mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            {lead}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/**
 * Sekční nadpis uvnitř stránky.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  actions,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-4 ${className}`.trim()}
    >
      <div className="max-w-xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="display-sm mt-1.5 text-2xl text-[var(--color-ink)] sm:text-3xl">
          {title}
        </h2>
        {lead ? (
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {lead}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/**
 * Standardní container — max-w-5xl, padding, vertical rytmus.
 */
export function PageContainer({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const max =
    size === "sm"
      ? "max-w-2xl"
      : size === "md"
        ? "max-w-4xl"
        : size === "lg"
          ? "max-w-5xl"
          : "max-w-6xl";
  return (
    <main className={`mx-auto w-full ${max} flex-1 px-6 py-12 ${className}`.trim()}>
      {children}
    </main>
  );
}
