import { POSTS } from "./posts";
import type { PostMeta } from "./types";

/**
 * Najde blog posty, které sdílejí alespoň jeden tag s `tags`,
 * vyloučí post se slugem `excludeSlug`. Vrátí seřazené dle počtu
 * sdílených tagů a pak dle data publikace.
 */
export function findRelatedPostsByTags(
  tags: string[],
  excludeSlug: string,
  limit = 4,
): PostMeta[] {
  if (!tags.length) return [];
  const tagSet = new Set(tags);
  const scored = POSTS.filter((p) => p.meta.slug !== excludeSlug)
    .map((p) => {
      const overlap = (p.meta.tags ?? []).filter((t) => tagSet.has(t));
      return { meta: p.meta, score: overlap.length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
      );
    })
    .slice(0, limit);
  return scored.map((x) => x.meta);
}

/**
 * Najde blog posty pro dané tagy (alespoň jeden tag musí sedět).
 * Seřadí dle počtu sdílených tagů, pak dle data publikace.
 * Vhodné pro "Z blogu" sekce na landing pages.
 */
export function findPostsByAnyTag(tags: string[], limit = 3): PostMeta[] {
  if (!tags.length) return [];
  const tagSet = new Set(tags);
  const scored = POSTS
    .map((p) => {
      const overlap = (p.meta.tags ?? []).filter((t) => tagSet.has(t));
      return { meta: p.meta, score: overlap.length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
      );
    })
    .slice(0, limit);
  return scored.map((x) => x.meta);
}

/** Posledních N postů — pro homepage a fallback. */
export function listRecentPosts(limit = 3): PostMeta[] {
  return POSTS.slice(0, limit).map((p) => p.meta);
}
