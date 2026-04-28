import { type ReactNode } from "react";

/**
 * Malé uppercase popisky nad nadpisy. Vždy v brand barvě, tracking 0.16em.
 */
export function Eyebrow({
  children,
  className = "",
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "ink" | "light";
}) {
  const toneClass =
    tone === "ink"
      ? "text-[var(--color-ink-muted)]"
      : tone === "light"
        ? "text-[var(--color-brand-200)]"
        : "text-[var(--color-brand-700)]";
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.16em] ${toneClass} ${className}`.trim()}
    >
      {children}
    </p>
  );
}

/**
 * Pill / badge — pro statusy, metadata, oborové kategorie.
 */
export function Pill({
  children,
  variant = "neutral",
  className = "",
}: {
  children: ReactNode;
  variant?: "neutral" | "brand" | "warning" | "danger" | "info" | "outline";
  className?: string;
}) {
  const variantClass =
    variant === "brand"
      ? "bg-[var(--color-brand-50)] text-[var(--color-brand-800)]"
      : variant === "warning"
        ? "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]"
        : variant === "danger"
          ? "bg-[var(--color-danger-bg)] text-[var(--color-danger)]"
          : variant === "info"
            ? "bg-sky-100 text-sky-800"
            : variant === "outline"
              ? "border border-[var(--color-line)] bg-[var(--color-paper)] text-[var(--color-ink-muted)]"
              : "bg-[var(--color-canvas-muted)] text-[var(--color-ink-muted)]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/**
 * Inline label pro formuláře — uppercase, tightly tracked.
 */
export function FieldLabel({
  children,
  required = false,
  className = "",
}: {
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] ${className}`.trim()}
    >
      {children}
      {required ? (
        <span className="ml-1 text-[var(--color-accent-500)]" aria-hidden>
          *
        </span>
      ) : null}
    </span>
  );
}
