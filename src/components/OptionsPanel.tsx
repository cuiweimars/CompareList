"use client";

import { useTranslations } from "next-intl";
import type { CompareUiOptions, DelimiterMode, NormalizationMode } from "@/lib/compare";

interface OptionsPanelProps extends CompareUiOptions {
  onChange: (opts: CompareUiOptions) => void;
}

export default function OptionsPanel({
  caseSensitive,
  trimWhitespace,
  removeDuplicates,
  ignoreEmpty,
  delimiter,
  customDelimiter,
  normalization,
  ignoreDiacritics = false,
  reorderNameTokens = false,
  defaultCountryCode = "",
  ignoreUrlProtocol = true,
  ignoreUrlWww = true,
  ignoreUrlTrailingSlash = true,
  ignoreUrlHash = true,
  onChange,
}: OptionsPanelProps) {
  const t = useTranslations("components.optionsPanel");
  const options = [
    {
      key: "caseSensitive" as const,
      label: t("caseSensitive.label"),
      desc: t("caseSensitive.desc"),
    },
    {
      key: "trimWhitespace" as const,
      label: t("trimWhitespace.label"),
      desc: t("trimWhitespace.desc"),
    },
    {
      key: "removeDuplicates" as const,
      label: t("removeDuplicates.label"),
      desc: t("removeDuplicates.desc"),
    },
    {
      key: "ignoreEmpty" as const,
      label: t("ignoreEmpty.label"),
      desc: t("ignoreEmpty.desc"),
    },
  ];

  const values: CompareUiOptions = {
    caseSensitive, trimWhitespace, removeDuplicates, ignoreEmpty, delimiter, customDelimiter, normalization,
    ignoreDiacritics, reorderNameTokens, defaultCountryCode,
    ignoreUrlProtocol, ignoreUrlWww, ignoreUrlTrailingSlash, ignoreUrlHash,
  };

  const advancedToggles: { key: keyof CompareUiOptions; label: string; desc: string }[] = [];
  if (normalization === "name" || normalization === "keyword") {
    advancedToggles.push({ key: "ignoreDiacritics", label: t("advanced.ignoreDiacritics.label"), desc: t("advanced.ignoreDiacritics.desc") });
  }
  if (normalization === "name") {
    advancedToggles.push({ key: "reorderNameTokens", label: t("advanced.reorderNameTokens.label"), desc: t("advanced.reorderNameTokens.desc") });
  }
  if (normalization === "url") {
    advancedToggles.push(
      { key: "ignoreUrlProtocol", label: t("advanced.ignoreUrlProtocol.label"), desc: t("advanced.ignoreUrlProtocol.desc") },
      { key: "ignoreUrlWww", label: t("advanced.ignoreUrlWww.label"), desc: t("advanced.ignoreUrlWww.desc") },
      { key: "ignoreUrlTrailingSlash", label: t("advanced.ignoreUrlTrailingSlash.label"), desc: t("advanced.ignoreUrlTrailingSlash.desc") },
      { key: "ignoreUrlHash", label: t("advanced.ignoreUrlHash.label"), desc: t("advanced.ignoreUrlHash.desc") },
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
        <label
          key={opt.key}
          className="flex items-center gap-2 cursor-pointer group select-none"
          title={opt.desc}
        >
          <button
            role="switch"
            aria-checked={values[opt.key] as boolean}
            onClick={() => onChange({ ...values, [opt.key]: !values[opt.key] })}
            className={`relative w-8 h-[22px] rounded-full transition-colors ${
              values[opt.key] ? "bg-primary" : "bg-surface-alt"
            }`}
          >
            <span
              className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${
                values[opt.key] ? "translate-x-[14px]" : ""
              }`}
            />
          </button>
          <span className="text-xs text-text-secondary group-hover:text-text transition-colors">
            {opt.label}
          </span>
        </label>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-border">
        <label className="flex flex-col gap-1 text-xs text-text-secondary">
          <span>{t("delimiter.label")}</span>
          <select
            value={delimiter}
            onChange={(event) => onChange({ ...values, delimiter: event.target.value as DelimiterMode })}
            className="min-w-36 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/60"
          >
            {(["auto", "newline", "comma", "semicolon", "tab", "custom"] as const).map((value) => (
              <option key={value} value={value}>{t(`delimiter.${value}`)}</option>
            ))}
          </select>
        </label>
        {delimiter === "custom" && (
          <label className="flex flex-col gap-1 text-xs text-text-secondary">
            <span>{t("delimiter.customValue")}</span>
            <input
              value={customDelimiter}
              maxLength={8}
              onChange={(event) => onChange({ ...values, customDelimiter: event.target.value })}
              className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/60"
            />
          </label>
        )}
        <label className="flex flex-col gap-1 text-xs text-text-secondary">
          <span>{t("normalization.label")}</span>
          <select
            value={normalization}
            onChange={(event) => onChange({ ...values, normalization: event.target.value as NormalizationMode })}
            className="min-w-36 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/60"
          >
            {(["generic", "email", "phone", "url", "name", "ip", "keyword"] as const).map((value) => (
              <option key={value} value={value}>{t(`normalization.${value}`)}</option>
            ))}
          </select>
        </label>
      </div>
      {(advancedToggles.length > 0 || normalization === "phone") && (
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
          {advancedToggles.map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer group select-none" title={opt.desc}>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(values[opt.key])}
                onClick={() => onChange({ ...values, [opt.key]: !values[opt.key] })}
                className={`relative w-8 h-[22px] rounded-full transition-colors ${values[opt.key] ? "bg-primary" : "bg-surface-alt"}`}
              >
                <span className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${values[opt.key] ? "translate-x-[14px]" : ""}`} />
              </button>
              <span className="text-xs text-text-secondary group-hover:text-text transition-colors">{opt.label}</span>
            </label>
          ))}
          {normalization === "phone" && (
            <label className="flex flex-col gap-1 text-xs text-text-secondary">
              <span>{t("advanced.defaultCountryCode.label")}</span>
              <input
                value={defaultCountryCode}
                placeholder="+1"
                inputMode="tel"
                maxLength={6}
                onChange={(event) => onChange({ ...values, defaultCountryCode: event.target.value })}
                className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/60"
                title={t("advanced.defaultCountryCode.desc")}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
