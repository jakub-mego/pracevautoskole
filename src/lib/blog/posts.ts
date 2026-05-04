import * as procVznika from "@/content/blog/proc-vznika-pracevautoskole";
import * as etestyPruvodce from "@/content/blog/etesty-autoskola-pruvodce";
import type { Post, PostMeta } from "./types";

const RAW_POSTS: Post[] = [
  { meta: procVznika.meta, Article: procVznika.default },
  { meta: etestyPruvodce.meta, Article: etestyPruvodce.default },
];

// Seřazené od nejnovějších.
export const POSTS: Post[] = [...RAW_POSTS].sort(
  (a, b) =>
    new Date(b.meta.publishedAt).getTime() -
    new Date(a.meta.publishedAt).getTime(),
);

export function getPostBySlug(slug: string): Post | null {
  return POSTS.find((p) => p.meta.slug === slug) ?? null;
}

export function listPostMetas(): PostMeta[] {
  return POSTS.map((p) => p.meta);
}
