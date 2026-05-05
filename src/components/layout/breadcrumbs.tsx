import Link from "next/link";

export type BreadcrumbItem = {
  /** Display label. */
  label: string;
  /** Absolute path on this site (without origin). Last item nemá href = current page. */
  href?: string;
};

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "https://pracevautoskole.cz";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Drobečková navigace"
        className="text-sm text-[var(--color-ink-muted)]"
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={`${item.label}-${i}`}>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-[var(--color-ink)]" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span className="mx-2 text-[var(--color-ink-soft)]">/</span>
              ) : null}
            </span>
          );
        })}
      </nav>
    </>
  );
}
