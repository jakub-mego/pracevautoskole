import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-[var(--color-canvas)] hover:bg-[var(--color-brand-900)]",
  secondary:
    "border border-[var(--color-line-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[var(--color-brand-700)] hover:text-[var(--color-brand-700)]",
  ghost:
    "text-[var(--color-ink-muted)] hover:bg-[var(--color-line-soft)] hover:text-[var(--color-ink)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:bg-[#8c2615]",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-full",
  md: "px-5 py-2.5 text-sm gap-2 rounded-full",
  lg: "px-6 py-3 text-base gap-2 rounded-full",
};

const BASE =
  "inline-flex items-center justify-center font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-[var(--color-brand-200)]";

export function buttonClassName({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      {...props}
      className={buttonClassName({ variant, size, className })}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  prefetch,
  target,
  rel,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
  target?: string;
  rel?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      target={target}
      rel={rel}
      className={buttonClassName({ variant, size, className })}
    >
      {children}
    </Link>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`transition group-hover:translate-x-0.5 ${className}`}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
