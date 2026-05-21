import type { Metadata } from "next";

export const metadata: Metadata = {
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
  alternates: { canonical: "https://comparelist.com/compare-ip-addresses" },
  twitter: {
    card: "summary_large_image",
    title: "Compare IP Address Lists Online - Free Tool",
    description: "Find matching, unique, and overlapping IPs between two lists instantly. Free and private.",
  },
};

export default function CompareIpAddressesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
