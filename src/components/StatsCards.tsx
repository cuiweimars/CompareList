"use client";

import { useTranslations } from "next-intl";

interface StatsCardsProps {
  stats: {
    totalA: number;
    totalB: number;
    uniqueA: number;
    uniqueB: number;
    common: number;
    matchRate: number;
    duplicatesA?: number;
    duplicatesB?: number;
    invalidA?: number;
    invalidB?: number;
    emptyA?: number;
    emptyB?: number;
  };
  onCardClick?: (cardIndex: number) => void;
}

export default function StatsCards({ stats, onCardClick }: StatsCardsProps) {
  const t = useTranslations("components.statsCards");
  const cards = [
    {
      label: t("matchRate"),
      value: `${stats.matchRate}%`,
      color: "#818cf8",
      glow: "rgba(129,140,248,0.3)",
      icon: "~",
    },
    {
      label: t("commonItems"),
      value: stats.common,
      color: "#34d399",
      glow: "rgba(52,211,153,0.3)",
      icon: "∩",
    },
    {
      label: t("onlyInListA"),
      value: stats.uniqueA,
      color: "#fbbf24",
      glow: "rgba(251,191,36,0.25)",
      icon: "A",
    },
    {
      label: t("onlyInListB"),
      value: stats.uniqueB,
      color: "#22d3ee",
      glow: "rgba(34,211,238,0.3)",
      icon: "B",
    },
  ];
  const duplicates = (stats.duplicatesA ?? 0) + (stats.duplicatesB ?? 0);
  const invalid = (stats.invalidA ?? 0) + (stats.invalidB ?? 0);
  const empty = (stats.emptyA ?? 0) + (stats.emptyB ?? 0);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        {cards.map((card, i) => (
        <div
          key={card.label}
          className={`glass rounded-xl p-4 sm:p-5 animate-fade-up group hover:border-border-active transition-all duration-300 ${onCardClick ? "cursor-pointer active:scale-[0.98]" : ""}`}
          style={{ animationDelay: `${i * 80}ms` }}
          onClick={() => onCardClick?.(i)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wide text-text-muted font-medium leading-snug">
              {card.label}
            </span>
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: `${card.color}15`, color: card.color }}
            >
              {card.icon}
            </span>
          </div>
          <div
            className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-sora)] stat-value"
            style={{ color: card.color, textShadow: `0 0 20px ${card.glow}` }}
          >
            {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
          </div>
        </div>
        ))}
      </div>
      {duplicates + invalid + empty > 0 && (
        <div className="text-xs text-amber-500 bg-amber-500/8 border border-amber-500/15 rounded-lg px-3 py-2">
          {t("diagnostics", { duplicates, invalid, empty })}
        </div>
      )}
    </div>
  );
}
