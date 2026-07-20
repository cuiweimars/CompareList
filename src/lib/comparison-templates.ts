import type { CompareUiOptions } from "@/lib/compare";

export interface ComparisonTemplate {
  id: "crm-email" | "inventory" | "migration" | "seo-url" | "keywords";
  name: Record<"en" | "zh", string>;
  description: Record<"en" | "zh", string>;
  options: Partial<CompareUiOptions>;
}

export const COMPARISON_TEMPLATES: ComparisonTemplate[] = [
  {
    id: "crm-email",
    name: { en: "CRM email audit", zh: "CRM 邮箱核对" },
    description: { en: "Normalize email casing and remove duplicates.", zh: "统一邮箱大小写并去除重复项。" },
    options: { normalization: "email", caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true },
  },
  {
    id: "inventory",
    name: { en: "Inventory snapshot", zh: "库存快照" },
    description: { en: "Compare SKU or item identifiers between snapshots.", zh: "比较两个时间点的 SKU 或物料编号。" },
    options: { normalization: "generic", caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true },
  },
  {
    id: "migration",
    name: { en: "Migration validation", zh: "迁移验收" },
    description: { en: "Validate record IDs before and after migration.", zh: "核对迁移前后的记录 ID。" },
    options: { normalization: "generic", caseSensitive: true, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true },
  },
  {
    id: "seo-url",
    name: { en: "SEO URL audit", zh: "SEO URL 核对" },
    description: { en: "Ignore protocol, www, hash, and trailing slash differences.", zh: "忽略协议、www、锚点和末尾斜杠差异。" },
    options: {
      normalization: "url",
      ignoreUrlProtocol: true,
      ignoreUrlWww: true,
      ignoreUrlTrailingSlash: true,
      ignoreUrlHash: true,
      caseSensitive: false,
    },
  },
  {
    id: "keywords",
    name: { en: "Keyword cleanup", zh: "关键词清洗" },
    description: { en: "Normalize accents and formatting for keyword lists.", zh: "统一关键词重音符号和格式。" },
    options: { normalization: "keyword", ignoreDiacritics: true, caseSensitive: false, trimWhitespace: true, removeDuplicates: true },
  },
];

export function localizedTemplate(template: ComparisonTemplate, locale: string) {
  const language = locale === "zh" ? "zh" : "en";
  return { ...template, name: template.name[language], description: template.description[language] };
}
