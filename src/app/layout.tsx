import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
