import type { MetadataRoute } from "next";
import {
  listSitemapListings,
  listSitemapProfiles,
} from "@/lib/sitemap/queries";
import { listPostMetas } from "@/lib/blog/posts";
import { listAllLandingPaths } from "@/lib/seo/landing-data";

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listingRows, profileRows] = await Promise.all([
    listSitemapListings(),
    listSitemapProfiles(),
  ]);
  const posts = listPostMetas();
  const { cities, roles, combos } = listAllLandingPaths();

  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE}/inzeraty`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE}/profese`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE}/kurzy-pro-ucitele`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...listingRows.map((l) => ({
      url: `${SITE}/inzeraty/${l.id}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...profileRows.map((p) => ({
      url: `${SITE}/p/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...cities.map((c) => ({
      url: `${SITE}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...roles.map((r) => ({
      url: `${SITE}/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...combos.map((c) => ({
      url: `${SITE}/${c.roleSlug}/${c.mestoSlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE}/podminky-pouzivani`,
      lastModified: new Date("2026-04-26"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE}/zasady-ochrany-osobnich-udaju`,
      lastModified: new Date("2026-04-26"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE}/cookies`,
      lastModified: new Date("2026-04-26"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
