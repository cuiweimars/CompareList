export interface CompareOptions {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  removeDuplicates: boolean;
  ignoreEmpty: boolean;
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
  };
}

const DEFAULT_OPTIONS: CompareOptions = {
  caseSensitive: false,
  trimWhitespace: true,
  removeDuplicates: true,
  ignoreEmpty: true,
};

function normalizeItem(item: string, options: CompareOptions): string {
  let result = item;
  if (options.trimWhitespace) {
    result = result.trim();
  }
  if (!options.caseSensitive) {
    result = result.toLowerCase();
  }
  return result;
}

function parseList(raw: string, options: CompareOptions): string[] {
  const lines = raw.split(/[\n,;\t]+/).map((s) => s.trim());
  let items = options.ignoreEmpty ? lines.filter((s) => s.length > 0) : lines;

  if (options.trimWhitespace) {
    items = items.map((s) => s.trim());
  }

  if (options.removeDuplicates) {
    const seen = new Map<string, string>();
    for (const item of items) {
      const key = normalizeItem(item, options);
      if (!seen.has(key)) {
        seen.set(key, item);
      }
    }
    items = Array.from(seen.values());
  }

  return items;
}

export function compareLists(
  rawA: string,
  rawB: string,
  options: Partial<CompareOptions> = {}
): CompareResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const listA = parseList(rawA, opts);
  const listB = parseList(rawB, opts);

  const setA = new Set(listA.map((s) => normalizeItem(s, opts)));
  const setB = new Set(listB.map((s) => normalizeItem(s, opts)));

  const originalMapA = new Map<string, string>();
  const originalMapB = new Map<string, string>();
  for (const item of listA) originalMapA.set(normalizeItem(item, opts), item);
  for (const item of listB) originalMapB.set(normalizeItem(item, opts), item);

  const onlyInA: string[] = [];
  const onlyInB: string[] = [];
  const inBoth: string[] = [];

  for (const key of setA) {
    if (setB.has(key)) {
      inBoth.push(originalMapA.get(key)!);
    } else {
      onlyInA.push(originalMapA.get(key)!);
    }
  }

  for (const key of setB) {
    if (!setA.has(key)) {
      onlyInB.push(originalMapB.get(key)!);
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
    },
  };
}
