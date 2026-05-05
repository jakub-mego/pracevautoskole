import type { ReactNode } from "react";

export function Faq({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-col gap-2">{children}</div>;
}

export function FaqItem({
  question,
  defaultOpen,
  children,
}: {
  question: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-5 py-4 transition open:border-[var(--color-brand-700)] open:shadow-[var(--shadow-card-hover)]"
    >
      <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <span
          aria-hidden
          className="shrink-0 text-lg leading-none text-[var(--color-ink-soft)] transition-transform duration-200 group-open:rotate-180 group-open:text-[var(--color-brand-700)]"
        >
          ▾
        </span>
      </summary>
      <div className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
        {children}
      </div>
    </details>
  );
}
