import * as procVznika from "@/content/blog/proc-vznika-pracevautoskole";
import * as etestyPruvodce from "@/content/blog/etesty-autoskola-pruvodce";
import * as ucitelBrno from "@/content/blog/ucitel-autoskoly-brno-kariera";
import * as ucitelPraha from "@/content/blog/ucitel-autoskoly-praha-kariera";
import * as testyBezStresu from "@/content/blog/testy-na-autoskolu-bez-stresu";
import type { Post, PostMeta } from "./types";

const RAW_POSTS: Post[] = [
  { meta: procVznika.meta, Article: procVznika.default },
  { meta: etestyPruvodce.meta, Article: etestyPruvodce.default },
  { meta: ucitelBrno.meta, Article: ucitelBrno.default },
  { meta: ucitelPraha.meta, Article: ucitelPraha.default },
  { meta: testyBezStresu.meta, Article: testyBezStresu.default },
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
