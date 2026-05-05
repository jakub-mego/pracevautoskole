import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Strict-Transport-Security se nastavuje na úrovni Caddy/Coolify (TLS termination tam),
  // ale pro jistotu pošleme i z aplikace.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // www → apex (jediná kanonická URL, lepší pro SEO)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pracevautoskole.cz" }],
        destination: "https://pracevautoskole.cz/:path*",
        permanent: true,
      },
      // Staré /prace-v-autoskole/* URL → root (přesun z 2026-05)
      {
        source: "/prace-v-autoskole",
        destination: "/profese",
        permanent: true,
      },
      {
        source: "/prace-v-autoskole/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/prace-v-autoskole/:slug/:mesto",
        destination: "/:slug/:mesto",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
