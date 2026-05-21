import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-ip-addresses";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare IP Address Lists Online Free - Network Diff Tool | CompareList",
    description:
      "Free IP address comparison tool. Find matching, unique, and overlapping IPs between two lists. Supports IPv4. Perfect for firewall audits and network inventory.",
    keywords: [
      "compare ip addresses",
      "ip address comparison",
      "compare ip lists",
      "network diff tool",
      "firewall ip comparison",
      "find duplicate ip addresses",
    ],
    openGraph: {
      title: "Compare IP Address Lists Online - Free Tool",
      description: "Find matching, unique, and overlapping IPs between two lists instantly. Free and private.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare IP Address Lists Online - Free Tool",
      description: "Find matching, unique, and overlapping IPs between two lists instantly. Free and private.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareIpAddressesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
