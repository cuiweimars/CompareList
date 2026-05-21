import { ArrowRightLeft, ArrowRight, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("components.notFound");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
        <ArrowRightLeft size={28} className="text-white" />
      </div>
      <h1 className="text-6xl font-bold font-[family-name:var(--font-sora)] hero-gradient-text mb-4">{t("title")}</h1>
      <h2 className="text-2xl font-semibold mb-3 font-[family-name:var(--font-sora)]">{t("subtitle")}</h2>
      <p className="text-text-secondary max-w-md mb-8">
        {t("description")}
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-xl"
        >
          <Home size={16} />
          {t("goHome")}
        </Link>
        <Link
          href="/#tool"
          className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-text-secondary border border-border rounded-xl hover:bg-surface-alt/50 transition-all"
        >
          {t("compareLists")} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
