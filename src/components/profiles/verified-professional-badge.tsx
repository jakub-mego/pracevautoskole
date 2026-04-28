export function VerifiedProfessionalBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  const cls =
    size === "md"
      ? "inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-sm font-medium text-sky-900"
      : "inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-900";
  const iconSize = size === "md" ? 14 : 12;
  return (
    <span
      className={cls}
      title="Profesní průkaz ověřený provozovatelem"
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden
      >
        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 6.22a.75.75 0 00-1.06-1.06L7 8.88 5.78 7.66a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l4.25-4.25z" />
      </svg>
      Ověřený profesionál
    </span>
  );
}
