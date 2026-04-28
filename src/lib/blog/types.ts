import type { ComponentType } from "react";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  author?: string;
  tags?: string[];
};

export type Post = {
  meta: PostMeta;
  Article: ComponentType;
};
