"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Lock, Coins } from "lucide-react";
import { getCredits } from "@/lib/credits";

interface AIInsightsProps {
  insights: string;
  fuzzyMatchCount: number;
  locked?: boolean;
  onUnlock?: () => void;
  onBuyCredits?: () => void;
}

export default function AIInsights({
  insights,
  fuzzyMatchCount,
  locked = false,
  onUnlock,
  onBuyCredits,
}: AIInsightsProps) {
  const t = useTranslations("components.aiInsights");
  const balance = typeof window !== "undefined" ? getCredits().balance : 0;
  const hasCredits = balance > 0;

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-gradient-to-r from-primary/8 to-accent/5">
        <Sparkles size={15} className="text-primary" />
        <span className="text-sm font-semibold">{t("title")}</span>
        {fuzzyMatchCount > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {t("fuzzyMatches", { count: fuzzyMatchCount, plural: fuzzyMatchCount !== 1 ? "es" : "" })}
          </span>
        )}
      </div>
      <div className="p-4 relative">
        {locked ? (
          <div className="relative">
            <p className="text-base text-text-secondary leading-relaxed blur-sm select-none line-clamp-4">
              {insights}
            </p>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm rounded-b-xl gap-3">
              <button
                onClick={onUnlock}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-white rounded-xl text-sm font-semibold"
              >
                <Lock size={15} />
                {t("viewAiAnalysis")}
                <span className="text-xs text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full ml-1">{t("free")}</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-base text-text-secondary leading-relaxed whitespace-pre-line">
            {insights}
          </p>
        )}
      </div>
    </div>
  );
}
