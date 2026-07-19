import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/remove-duplicates-from-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "removeDuplicatesFromList" });

  return buildMetadata({
    locale,
    path: basePath,
    title: `${t("hero.title")} | CompareList`,
    description: t("hero.subtitle"),
  });
}

export default function RemoveDuplicatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
