import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/listings",
          "/listings/",
          "/profile",
          "/profile/",
          "/payments",
          "/payments/",
          "/onboarding",
          "/onboarding/",
          "/sign-in",
          "/sign-up",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
