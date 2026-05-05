import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, POSTS } from "@/lib/blog/posts";
import { findRelatedPostsByTags } from "@/lib/blog/related";
import { BlogTeasers } from "@/components/blog/blog-teasers";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Článek nenalezen" };
  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.publishedAt,
      authors: post.meta.author ? [post.meta.author] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const { meta, Article } = post;
  const related = findRelatedPostsByTags(meta.tags ?? [], meta.slug, 4);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: meta.title },
        ]}
      />

      <header className="mt-6">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
          {new Date(meta.publishedAt).toLocaleDateString("cs-CZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {meta.author ? ` · ${meta.author}` : ""}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
          {meta.title}
        </h1>
        <p className="mt-3 text-lg text-[var(--color-ink-muted)]">{meta.description}</p>
      </header>

      <article
        className="mt-10 max-w-none text-[var(--color-ink)]
          [&_p]:mt-4 [&_p]:leading-relaxed
          [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--color-ink)]
          [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--color-ink)]
          [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6
          [&_li]:mt-1
          [&_a]:font-medium [&_a]:text-[var(--color-ink)] [&_a]:underline
          [&_strong]:font-semibold [&_strong]:text-[var(--color-ink)]
          [&_code]:rounded [&_code]:bg-[var(--color-canvas-muted)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm"
      >
        <Article />
      </article>

      <BlogTeasers
        posts={related}
        heading="Mohlo by tě taky zajímat"
        subheading="Další články k tématům, která tě přivedla sem."
      />

      <footer className="mt-16 border-t border-[var(--color-line)] pt-8">
        <p className="text-sm text-[var(--color-ink-muted)]">
          Líbí se ti, co děláme?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-[var(--color-ink)] underline"
          >
            Vyzkoušej platformu
          </Link>{" "}
          nebo se podělej o článek.
        </p>
      </footer>
    </main>
  );
}
