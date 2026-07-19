import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import InfoPage from "@/components/InfoPage";
import { aboutContent } from "@/lib/info-content";
import { buildMetadata } from "@/lib/seo";
import { type Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const content = aboutContent[locale];
  return buildMetadata({ locale, path: "/about", title: `${content.title} | CompareList`, description: content.description });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = aboutContent[locale];
  return <InfoPage title={content.title} intro={content.intro} sections={content.sections} backLabel={locale === "zh" ? "返回工具" : "Back to tool"} />;
}
