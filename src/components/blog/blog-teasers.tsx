import Link from "next/link";
import type { PostMeta } from "@/lib/blog/types";

type Props = {
  posts: PostMeta[];
  /** Heading nad seznamem. Když není, sekce se nerenderuje. */
  heading?: string;
  /** Popisek pod headingem. */
  subheading?: string;
  /** Compact = malé karty pro sidebar. Default = středně velké pro hlavní obsah. */
  variant?: "default" | "compact";
};

export function BlogTeasers({
  posts,
  heading,
  subheading,
  variant = "default",
}: Props) {
  if (!posts.length) return null;

  return (
    <section className="mt-10">
      {heading ? (
        <h2 className="display-xs text-xl text-[var(--color-ink)]">{heading}</h2>
      ) : null}
      {subheading ? (
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          {subheading}
        </p>
      ) : null}
      <ul
        className={
          "mt-4 grid gap-4 " +
          (variant === "compact"
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2")
        }
      >
        {posts.map((p) => (
          <li
            key={p.slug}
            className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-brand-700)] hover:shadow-[var(--shadow-card-hover)]"
          >
            <Link href={`/blog/${p.slug}`} className="block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
                Blog
              </p>
              <h3 className="display-xs mt-1.5 text-base text-[var(--color-ink)] sm:text-lg">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--color-ink-muted)]">
                {p.description}
              </p>
              <p className="mt-3 text-xs font-medium text-[var(--color-brand-700)]">
                Číst →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
