import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import { PaddleProvider } from "@/lib/paddle/context";
import Analytics from "@/components/Analytics";
import { routing } from "@/i18n/routing";
import "../globals.css";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#818cf8" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com"}/${locale}`} />
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
        <NextIntlClientProvider messages={messages}>
          <Analytics />
          <PaddleProvider>{children}</PaddleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
