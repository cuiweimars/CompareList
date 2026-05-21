import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare IP Addresses - CompareList | Free Online Tool",
  description:
    "Compare two IP address lists instantly. Find differences, common IPs, and unique entries. Free, private, no signup required.",
};

export default function CompareIpAddressesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
