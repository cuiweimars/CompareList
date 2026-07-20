"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, X } from "lucide-react";
import { fuzzyMatchId, type FuzzyMatch } from "@/lib/ai-compare";
import { getWorkspaceCopy } from "@/lib/workspace-copy";
import { event as trackEvent } from "@/lib/gtag";

interface FuzzyMatchTableProps {
  matches: FuzzyMatch[];
  rejected?: Set<string>;
  onDecision?: (matchId: string, accepted: boolean) => void;
}

const reasonKeys: Record<string, "reasons.exact" | "reasons.tokenOrder" | "reasons.minorDifference" | "reasons.similarStructure"> = {
  exact: "reasons.exact",
  "token-order": "reasons.tokenOrder",
  "minor-difference": "reasons.minorDifference",
  "similar-structure": "reasons.similarStructure",
};

export default function FuzzyMatchTable({ matches, rejected = new Set(), onDecision }: FuzzyMatchTableProps) {
  const t = useTranslations("components.fuzzyMatchTable");
  const copy = getWorkspaceCopy(useLocale());

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
        <span className="shrink-0 text-sm font-semibold">{t("title")}</span>
        <span className="text-xs text-text-muted">
          {t("subtitle")}
        </span>
      </div>
      <div className="divide-y divide-border">
        {matches.map((match, i) => {
          const matchId = fuzzyMatchId(match, i);
          const isRejected = rejected.has(matchId);
          return (
          <div key={matchId} className={`px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center ${isRejected ? "bg-danger/5" : ""}`}>
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
            {onDecision && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-pressed={!isRejected}
                  onClick={() => { onDecision(matchId, true); trackEvent("fuzzy_match_reviewed", { decision: "accepted" }); }}
                  className={`min-h-9 inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs ${!isRejected ? "border-success/35 bg-success/10 text-success" : "border-border text-text-muted hover:text-text"}`}
                >
                  <Check size={13} /> {!isRejected ? copy.matchAccepted : copy.acceptMatch}
                </button>
                <button
                  type="button"
                  aria-pressed={isRejected}
                  onClick={() => { onDecision(matchId, false); trackEvent("fuzzy_match_reviewed", { decision: "rejected" }); }}
                  className={`min-h-9 inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs ${isRejected ? "border-danger/35 bg-danger/10 text-danger" : "border-border text-text-muted hover:text-text"}`}
                >
                  <X size={13} /> {isRejected ? copy.matchRejected : copy.rejectMatch}
                </button>
              </div>
            )}
          </div>
        );})}
      </div>
    </div>
  );
}
