export type DelimiterMode = "auto" | "newline" | "comma" | "semicolon" | "tab" | "custom";
export type NormalizationMode = "generic" | "email" | "phone" | "url" | "name" | "ip" | "keyword";

export interface CompareOptions {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  removeDuplicates: boolean;
  ignoreEmpty: boolean;
  delimiter: DelimiterMode;
  customDelimiter: string;
  normalization: NormalizationMode;
  ignoreDiacritics: boolean;
  reorderNameTokens: boolean;
  defaultCountryCode: string;
  ignoreUrlProtocol: boolean;
  ignoreUrlWww: boolean;
  ignoreUrlTrailingSlash: boolean;
  ignoreUrlHash: boolean;
}

export interface CompareResult {
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
  stats: {
    totalA: number;
    totalB: number;
    uniqueA: number;
    uniqueB: number;
    common: number;
    matchRate: number;
    duplicatesA: number;
    duplicatesB: number;
    invalidA: number;
    invalidB: number;
    emptyA: number;
    emptyB: number;
  };
}

export interface ListDiagnostics {
  rawCount: number;
  duplicateCount: number;
  emptyCount: number;
  invalidCount: number;
  invalidItems: string[];
}

export type CompareUiOptions = Pick<
  CompareOptions,
  "caseSensitive" | "trimWhitespace" | "removeDuplicates" | "ignoreEmpty" | "delimiter" | "customDelimiter" | "normalization"
> & Partial<Pick<
  CompareOptions,
  "ignoreDiacritics" | "reorderNameTokens" | "defaultCountryCode" | "ignoreUrlProtocol" | "ignoreUrlWww" | "ignoreUrlTrailingSlash" | "ignoreUrlHash"
>>;

export const DEFAULT_OPTIONS: CompareOptions = {
  caseSensitive: false,
  trimWhitespace: true,
  removeDuplicates: true,
  ignoreEmpty: true,
  delimiter: "auto",
  customDelimiter: "",
  normalization: "generic",
  ignoreDiacritics: false,
  reorderNameTokens: false,
  defaultCountryCode: "",
  ignoreUrlProtocol: true,
  ignoreUrlWww: true,
  ignoreUrlTrailingSlash: true,
  ignoreUrlHash: true,
};

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ");
}

function normalizePhone(value: string, defaultCountryCode: string): string {
  const hasInternationalPrefix = /^\s*(?:\+|00)/.test(value);
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);

  const countryCode = defaultCountryCode.replace(/\D/g, "");
  if (!hasInternationalPrefix && countryCode && !digits.startsWith(countryCode)) {
    digits = `${countryCode}${digits}`;
  }
  return digits;
}

function normalizeUrl(value: string, options: CompareOptions): string {
  const source = value.trim();
  if (!source) return source;

  try {
    const hasProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(source);
    const url = new URL(hasProtocol ? source : `https://${source}`);
    let host = url.hostname.toLowerCase();
    if (options.ignoreUrlWww) host = host.replace(/^www\./, "");

    let pathname = url.pathname.replace(/\/{2,}/g, "/");
    if (options.ignoreUrlTrailingSlash && pathname !== "/") pathname = pathname.replace(/\/$/, "");
    if (pathname === "/" && options.ignoreUrlTrailingSlash) pathname = "";

    const port = url.port && !((url.protocol === "http:" && url.port === "80") || (url.protocol === "https:" && url.port === "443"))
      ? `:${url.port}`
      : "";
    const protocol = options.ignoreUrlProtocol ? "" : `${url.protocol}//`;
    const hash = options.ignoreUrlHash ? "" : url.hash;
    return `${protocol}${host}${port}${pathname}${url.search}${hash}`;
  } catch {
    return source;
  }
}

function normalizeName(value: string, options: CompareOptions): string {
  let normalized = value.normalize("NFKC").replace(/[\p{P}\p{S}]+/gu, " ");
  if (options.ignoreDiacritics) {
    normalized = normalized.normalize("NFD").replace(/\p{M}+/gu, "");
  }
  normalized = normalizeWhitespace(normalized).trim();
  if (options.reorderNameTokens) {
    normalized = normalized.split(" ").filter(Boolean).sort((a, b) => a.localeCompare(b)).join(" ");
  }
  return normalized;
}

function normalizeIp(value: string): string {
  const source = value.trim().toLowerCase();
  const [address, prefix] = source.split("/");
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(address)) {
    const octets = address.split(".").map((part) => Number(part));
    if (octets.every((part) => part >= 0 && part <= 255)) {
      return `${octets.join(".")}${prefix === undefined ? "" : `/${Number(prefix)}`}`;
    }
  }
  return source;
}

export function normalizeItem(item: string, partialOptions: Partial<CompareOptions> = {}): string {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
  let result = options.trimWhitespace ? item.trim() : item;

  switch (options.normalization) {
    case "email":
      result = result.trim().normalize("NFKC").toLowerCase();
      break;
    case "phone":
      result = normalizePhone(result, options.defaultCountryCode);
      break;
    case "url":
      result = normalizeUrl(result, options);
      break;
    case "name":
      result = normalizeName(result, options);
      break;
    case "ip":
      result = normalizeIp(result);
      break;
    case "keyword":
      result = normalizeWhitespace(result.normalize("NFKC")).trim();
      if (options.ignoreDiacritics) {
        result = result.normalize("NFD").replace(/\p{M}+/gu, "");
      }
      break;
    default:
      break;
  }

  if (!options.caseSensitive && options.normalization !== "phone") {
    result = result.toLocaleLowerCase();
  }
  return result;
}

function resolveDelimiter(raw: string, options: CompareOptions): string | RegExp {
  switch (options.delimiter) {
    case "newline": return /\r?\n/;
    case "comma": return ",";
    case "semicolon": return ";";
    case "tab": return "\t";
    case "custom": return options.customDelimiter || /\r?\n/;
    case "auto":
    default:
      if (/\r?\n/.test(raw)) return /\r?\n/;
      if (raw.includes("\t")) return "\t";
      if (raw.includes(";")) return ";";
      if (raw.includes(",")) return ",";
      return /\r?\n/;
  }
}

export function parseList(raw: string, partialOptions: Partial<CompareOptions> = {}): string[] {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
  const delimiter = resolveDelimiter(raw, options);
  let items = raw.split(delimiter);

  if (options.trimWhitespace) items = items.map((item) => item.trim());
  if (options.ignoreEmpty) items = items.filter((item) => item.length > 0);

  if (options.removeDuplicates) {
    const seen = new Set<string>();
    items = items.filter((item) => {
      const key = normalizeItem(item, options);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  return items;
}

function isValidForMode(value: string, mode: NormalizationMode): boolean {
  if (!value) return false;
  switch (mode) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value);
    case "phone": {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    }
    case "url":
      try {
        const source = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
        return Boolean(new URL(source).hostname.includes("."));
      } catch {
        return false;
      }
    case "ip": {
      const [address, prefix] = value.trim().split("/");
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(address)) return false;
      if (!address.split(".").every((part) => Number(part) >= 0 && Number(part) <= 255)) return false;
      return prefix === undefined || (/^\d{1,2}$/.test(prefix) && Number(prefix) <= 32);
    }
    default:
      return true;
  }
}

export function analyzeList(raw: string, partialOptions: Partial<CompareOptions> = {}): ListDiagnostics {
  if (!raw) return { rawCount: 0, duplicateCount: 0, emptyCount: 0, invalidCount: 0, invalidItems: [] };
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
  const items = raw.split(resolveDelimiter(raw, options)).map((item) => options.trimWhitespace ? item.trim() : item);
  const nonEmpty = items.filter((item) => item.length > 0);
  const seen = new Set<string>();
  let duplicateCount = 0;
  for (const item of nonEmpty) {
    const key = normalizeItem(item, options);
    if (seen.has(key)) duplicateCount += 1;
    else seen.add(key);
  }
  const invalidItems = nonEmpty.filter((item) => !isValidForMode(item, options.normalization));
  return {
    rawCount: items.length,
    duplicateCount,
    emptyCount: items.length - nonEmpty.length,
    invalidCount: invalidItems.length,
    invalidItems: invalidItems.slice(0, 20),
  };
}

export function compareLists(
  rawA: string,
  rawB: string,
  partialOptions: Partial<CompareOptions> = {}
): CompareResult {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
  const listA = parseList(rawA, options);
  const listB = parseList(rawB, options);
  const diagnosticsA = analyzeList(rawA, options);
  const diagnosticsB = analyzeList(rawB, options);

  const availableB = new Map<string, string[]>();
  for (const item of listB) {
    const key = normalizeItem(item, options);
    const bucket = availableB.get(key) ?? [];
    bucket.push(item);
    availableB.set(key, bucket);
  }

  const onlyInA: string[] = [];
  const inBoth: string[] = [];
  for (const item of listA) {
    const key = normalizeItem(item, options);
    const bucket = availableB.get(key);
    if (bucket?.length) {
      inBoth.push(item);
      bucket.shift();
    } else {
      onlyInA.push(item);
    }
  }

  const onlyInB: string[] = [];
  for (const item of listB) {
    const key = normalizeItem(item, options);
    const bucket = availableB.get(key);
    if (bucket?.length && bucket[0] === item) {
      onlyInB.push(item);
      bucket.shift();
    }
  }

  const totalA = listA.length;
  const totalB = listB.length;
  const common = inBoth.length;
  const matchRate = totalA + totalB > 0 ? Math.round((2 * common * 100) / (totalA + totalB)) : 0;

  return {
    onlyInA,
    onlyInB,
    inBoth,
    stats: {
      totalA,
      totalB,
      uniqueA: onlyInA.length,
      uniqueB: onlyInB.length,
      common,
      matchRate,
      duplicatesA: diagnosticsA.duplicateCount,
      duplicatesB: diagnosticsB.duplicateCount,
      invalidA: diagnosticsA.invalidCount,
      invalidB: diagnosticsB.invalidCount,
      emptyA: diagnosticsA.emptyCount,
      emptyB: diagnosticsB.emptyCount,
    },
  };
}
