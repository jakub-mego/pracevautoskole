import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: Tag = "div",
  variant = "paper",
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
  variant?: "paper" | "subtle" | "outline";
  hoverable?: boolean;
}) {
  const variantClass =
    variant === "subtle"
      ? "border border-[var(--color-line-soft)] bg-[var(--color-canvas-muted)]"
      : variant === "outline"
        ? "border border-[var(--color-line)] bg-transparent"
        : "border border-[var(--color-line)] bg-[var(--color-paper)]";

  const hoverClass = hoverable
    ? "transition hover:-translate-y-0.5 hover:border-[var(--color-brand-700)] hover:shadow-[var(--shadow-card-hover)]"
    : "";

  return (
    <Tag
      className={`rounded-2xl ${variantClass} ${hoverClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className}`.trim()}>{children}</div>;
}
