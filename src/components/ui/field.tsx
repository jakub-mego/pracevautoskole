import { type ComponentProps, type ReactNode } from "react";

const FIELD_BASE =
  "w-full rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-soft)] focus:border-[var(--color-brand-700)] focus:ring-4 focus:ring-[var(--color-brand-100)]";

export const fieldClass = FIELD_BASE;

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className = "",
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`.trim()}>
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          {label}
          {required ? (
            <span className="ml-1 text-[var(--color-accent-500)]" aria-hidden>
              *
            </span>
          ) : null}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="text-xs text-[var(--color-danger)]">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[var(--color-ink-soft)]">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={`${FIELD_BASE} ${props.className ?? ""}`.trim()}
    />
  );
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={`${FIELD_BASE} ${props.className ?? ""}`.trim()}
    />
  );
}

export function Select(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={`${FIELD_BASE} appearance-none bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10 ${props.className ?? ""}`.trim()}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%235a5a55' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M3 5l3 3 3-3'/></svg>\")",
        ...(props.style ?? {}),
      }}
    >
      {props.children}
    </select>
  );
}
