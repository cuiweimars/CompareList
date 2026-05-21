"use client";

import { useTranslations } from "next-intl";

interface OptionsPanelProps {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  removeDuplicates: boolean;
  ignoreEmpty: boolean;
  onChange: (opts: {
    caseSensitive: boolean;
    trimWhitespace: boolean;
    removeDuplicates: boolean;
    ignoreEmpty: boolean;
  }) => void;
}

export default function OptionsPanel({
  caseSensitive,
  trimWhitespace,
  removeDuplicates,
  ignoreEmpty,
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

  const values = { caseSensitive, trimWhitespace, removeDuplicates, ignoreEmpty };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label
          key={opt.key}
          className="flex items-center gap-2 cursor-pointer group select-none"
          title={opt.desc}
        >
          <button
            role="switch"
            aria-checked={values[opt.key]}
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
  );
}
