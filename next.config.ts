import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/pricing", destination: "/", permanent: true },
      { source: "/:locale(zh|ja|es|fr|de)/pricing", destination: "/:locale", permanent: true },
      { source: "/compare-two-columns-excel", destination: "/compare-excel-columns", permanent: true },
      { source: "/:locale(zh|ja|es|fr|de)/compare-two-columns-excel", destination: "/:locale/compare-excel-columns", permanent: true },
      { source: "/compare-csv-columns", destination: "/compare-csv-files", permanent: true },
      { source: "/:locale(zh|ja|es|fr|de)/compare-csv-columns", destination: "/:locale/compare-csv-files", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
