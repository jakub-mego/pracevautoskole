import Link from "next/link";
import { listPostMetas } from "@/lib/blog/posts";

export const metadata = {
  title: "Blog",
  description:
    "Články o trhu práce v autoškolách, oboru a o tom, jak na pracevautoskole.cz hledat a inzerovat.",
};

export default function BlogIndexPage() {
  const posts = listPostMetas();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-3xl text-[var(--color-ink)] sm:text-4xl">
        Blog
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Krátké texty o oboru autoškol, zkušenostech z trhu a o platformě.
      </p>

      <ul className="mt-10 flex flex-col gap-4">
        {posts.map((p) => (
          <li
            key={p.slug}
            className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-brand-700)]"
          >
            <Link href={`/blog/${p.slug}`} className="block">
              <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
                {new Date(p.publishedAt).toLocaleDateString("cs-CZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {p.author ? ` · ${p.author}` : ""}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
