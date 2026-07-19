"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

interface FuzzyMatch {
  itemA: string;
  itemB: string;
  confidence: number;
  reason: string;
}

interface FuzzyMatchTableProps { matches: FuzzyMatch[]; }

const reasonKeys: Record<string, "reasons.exact" | "reasons.tokenOrder" | "reasons.minorDifference" | "reasons.similarStructure"> = {
  exact: "reasons.exact",
  "token-order": "reasons.tokenOrder",
  "minor-difference": "reasons.minorDifference",
  "similar-structure": "reasons.similarStructure",
};

export default function FuzzyMatchTable({ matches }: FuzzyMatchTableProps) {
  const t = useTranslations("components.fuzzyMatchTable");

  if (matches.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-sm text-text-muted">{t("noMatches")}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="text-sm font-semibold">{t("title")}</span>
        <span className="text-xs text-text-muted">
          {t("subtitle")}
        </span>
      </div>
      <div className="divide-y divide-border">
        {matches.map((match, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm min-w-0">
                <span className="font-mono truncate text-amber-600 shrink-0 max-w-[40%]" title={match.itemA}>
                  {match.itemA}
                </span>
                <ArrowRight size={12} className="text-text-muted shrink-0" />
                <span className="font-mono truncate text-cyan-600 min-w-0" title={match.itemB}>
                  {match.itemB}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    match.confidence >= 0.9
                      ? "bg-green-100 text-green-700"
                      : match.confidence >= 0.75
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {Math.round(match.confidence * 100)}%
                </span>
                <span className="text-xs text-text-muted">{t(reasonKeys[match.reason] ?? "reasons.similarStructure")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
