import { CompareOptions, compareLists, normalizeItem, parseList } from "@/lib/compare";

export interface FuzzyMatch {
  itemA: string;
  itemB: string;
  confidence: number;
  reason: "exact" | "token-order" | "minor-difference" | "similar-structure";
}

export interface SmartCompareResult {
  fuzzyMatches: FuzzyMatch[];
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
  stats: {
    totalA: number;
    totalB: number;
    exactMatches: number;
    fuzzyMatches: number;
    totalMatchRate: number;
  };
}

export function computeFuzzyScore(a: string, b: string): number {
  const normA = a.toLocaleLowerCase().trim();
  const normB = b.toLocaleLowerCase().trim();
  if (normA === normB) return 1;
  if (!normA.length || !normB.length) return 0;

  const previous = Array.from({ length: normB.length + 1 }, (_, index) => index);
  const current = new Array<number>(normB.length + 1);

  for (let i = 1; i <= normA.length; i++) {
    current[0] = i;
    for (let j = 1; j <= normB.length; j++) {
      const cost = normA[i - 1] === normB[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    for (let j = 0; j <= normB.length; j++) previous[j] = current[j];
  }

  return 1 - previous[normB.length] / Math.max(normA.length, normB.length);
}

function tokenize(value: string): Set<string> {
  return new Set(
    value
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[\p{P}\p{S}]+/gu, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
}

function jaccardSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (!tokensA.size || !tokensB.size) return 0;

  let intersection = 0;
  for (const token of tokensA) if (tokensB.has(token)) intersection++;
  return intersection / (tokensA.size + tokensB.size - intersection);
}

function ngrams(value: string): Set<string> {
  const compact = value.normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  if (compact.length <= 3) return new Set(compact ? [compact] : []);
  const grams = new Set<string>();
  for (let index = 0; index <= compact.length - 3; index++) grams.add(compact.slice(index, index + 3));
  return grams;
}

function scorePair(a: string, b: string): { score: number; reason: FuzzyMatch["reason"] } {
  const editScore = computeFuzzyScore(a, b);
  const tokenScore = jaccardSimilarity(a, b);
  const score = Math.max(editScore, tokenScore);

  if (tokenScore === 1 && editScore < 1) return { score, reason: "token-order" };
  if (editScore >= 0.9) return { score, reason: "minor-difference" };
  return { score, reason: "similar-structure" };
}

export function fuzzyCompareLists(
  listA: string[],
  listB: string[],
  threshold = 0.72,
  partialOptions: Partial<CompareOptions> = {}
): { fuzzyMatches: FuzzyMatch[]; unmatchedA: string[]; unmatchedB: string[] } {
  const options = { ...partialOptions, removeDuplicates: false };
  const usedA = new Set<number>();
  const usedB = new Set<number>();
  const fuzzyMatches: FuzzyMatch[] = [];

  const normalizedA = listA.map((item) => normalizeItem(item, options));
  const normalizedB = listB.map((item) => normalizeItem(item, options));

  // Consume exact matches first so fuzzy candidates cannot steal them.
  for (let i = 0; i < listA.length; i++) {
    const matchIndex = normalizedB.findIndex((value, index) => !usedB.has(index) && value === normalizedA[i]);
    if (matchIndex >= 0) {
      usedA.add(i);
      usedB.add(matchIndex);
      fuzzyMatches.push({ itemA: listA[i], itemB: listB[matchIndex], confidence: 1, reason: "exact" });
    }
  }

  const invertedNgrams = new Map<string, Set<number>>();
  normalizedB.forEach((value, index) => {
    if (usedB.has(index)) return;
    for (const gram of ngrams(value)) {
      const bucket = invertedNgrams.get(gram) ?? new Set<number>();
      bucket.add(index);
      invertedNgrams.set(gram, bucket);
    }
  });

  const candidates: Array<{ a: number; b: number; score: number; reason: FuzzyMatch["reason"] }> = [];
  for (let i = 0; i < listA.length; i++) {
    if (usedA.has(i)) continue;
    const likelyMatches = new Set<number>();
    for (const gram of ngrams(normalizedA[i])) {
      for (const index of invertedNgrams.get(gram) ?? []) likelyMatches.add(index);
    }
    if (likelyMatches.size === 0) {
      for (let index = 0; index < normalizedB.length; index++) {
        if (!usedB.has(index) && (
          normalizedA[i][0] === normalizedB[index][0]
          || Math.abs(normalizedA[i].length - normalizedB[index].length) <= 1
        )) likelyMatches.add(index);
        if (likelyMatches.size >= 200) break;
      }
    }

    const candidateIndexes = Array.from(likelyMatches)
      .filter((index) => !usedB.has(index))
      .sort((left, right) => Math.abs(normalizedA[i].length - normalizedB[left].length) - Math.abs(normalizedA[i].length - normalizedB[right].length))
      .slice(0, 200);

    for (const j of candidateIndexes) {
      if (usedB.has(j)) continue;

      const maxLength = Math.max(normalizedA[i].length, normalizedB[j].length);
      if (maxLength > 8 && Math.abs(normalizedA[i].length - normalizedB[j].length) / maxLength > 0.5) continue;

      const candidate = scorePair(normalizedA[i], normalizedB[j]);
      if (candidate.score >= threshold) candidates.push({ a: i, b: j, ...candidate });
    }
  }

  // Highest-confidence pairs win, producing deterministic one-to-one matches.
  candidates.sort((left, right) => right.score - left.score || left.a - right.a || left.b - right.b);
  for (const candidate of candidates) {
    if (usedA.has(candidate.a) || usedB.has(candidate.b)) continue;
    usedA.add(candidate.a);
    usedB.add(candidate.b);
    fuzzyMatches.push({
      itemA: listA[candidate.a],
      itemB: listB[candidate.b],
      confidence: Math.round(candidate.score * 100) / 100,
      reason: candidate.reason,
    });
  }

  return {
    fuzzyMatches,
    unmatchedA: listA.filter((_, index) => !usedA.has(index)),
    unmatchedB: listB.filter((_, index) => !usedB.has(index)),
  };
}

export function smartCompareLists(
  rawA: string,
  rawB: string,
  partialOptions: Partial<CompareOptions> = {},
  threshold = 0.72
): SmartCompareResult {
  const exact = compareLists(rawA, rawB, partialOptions);
  const listA = parseList(rawA, partialOptions);
  const listB = parseList(rawB, partialOptions);
  const comparison = fuzzyCompareLists(listA, listB, threshold, partialOptions);
  const exactMatches = comparison.fuzzyMatches.filter((match) => match.reason === "exact");
  const fuzzyMatches = comparison.fuzzyMatches.filter((match) => match.reason !== "exact");
  const totalMatches = exactMatches.length + fuzzyMatches.length;
  const totalMatchRate = listA.length + listB.length
    ? Math.round((2 * totalMatches * 100) / (listA.length + listB.length))
    : 0;

  return {
    fuzzyMatches,
    onlyInA: comparison.unmatchedA,
    onlyInB: comparison.unmatchedB,
    inBoth: exact.inBoth,
    stats: {
      totalA: listA.length,
      totalB: listB.length,
      exactMatches: exactMatches.length,
      fuzzyMatches: fuzzyMatches.length,
      totalMatchRate,
    },
  };
}
