import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import InfoPage from "@/components/InfoPage";
import { privacyContent } from "@/lib/info-content";
import { buildMetadata } from "@/lib/seo";
import { type Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const content = privacyContent[locale];
  return buildMetadata({ locale, path: "/privacy", title: `${content.title} | CompareList`, description: content.description });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = privacyContent[locale];
  return <InfoPage title={content.title} intro={content.intro} sections={content.sections} backLabel={locale === "zh" ? "返回工具" : "Back to tool"} />;
}
