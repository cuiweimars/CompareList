import type { Metadata } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import { PaddleProvider } from "@/lib/paddle/context";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CompareList - Smart List Comparison Tool | Compare Two Lists Online Free",
  description:
    "Free online tool to compare two lists instantly. Find differences, common items, and unique entries. Supports CSV, TXT, and Excel files. No signup required.",
  keywords: [
    "compare list",
    "compare two lists",
    "list comparison tool",
    "list diff",
    "find differences between lists",
    "compare lists online",
    "list difference finder",
  ],
  openGraph: {
    title: "CompareList - Smart List Comparison Tool",
    description:
      "Free online tool to compare two lists instantly. Find differences, common items, and unique entries.",
    type: "website",
    siteName: "CompareList",
  },
  twitter: {
    card: "summary_large_image",
    title: "CompareList - Smart List Comparison Tool",
    description:
      "Free online tool to compare two lists instantly. Find differences, common items, and unique entries.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CompareList",
              description:
                "Free online tool to compare two lists instantly. Find differences, common items, and unique entries.",
              url: process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030712] bg-grid">
        <PaddleProvider>{children}</PaddleProvider>
      </body>
    </html>
  );
}
