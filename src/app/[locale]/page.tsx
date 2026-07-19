import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HomePage from "@/components/HomePage";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  return buildMetadata({
    locale,
    title: t("seo.title"),
    description: t("seo.description"),
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const url = localizedUrl(locale);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "CompareList",
            url,
            inLanguage: locale,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "CompareList",
            description: t("seo.description"),
            url,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Exact list comparison",
              "Local smart matching",
              "CSV and Excel import",
              "CSV and TXT export",
            ],
          },
        ]}
      />
      <HomePage />
    </>
  );
}
