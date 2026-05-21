export interface FuzzyMatch {
  itemA: string;
  itemB: string;
  confidence: number;
  reason: string;
}

export interface AICompareResult {
  fuzzyMatches: FuzzyMatch[];
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
  insights: string;
  stats: {
    exactMatches: number;
    fuzzyMatches: number;
    totalMatchRate: number;
  };
}

export function computeFuzzyScore(a: string, b: string): number {
  const normA = a.toLowerCase().trim();
  const normB = b.toLowerCase().trim();

  if (normA === normB) return 1.0;

  // Levenshtein-based similarity
  const matrix: number[][] = [];
  for (let i = 0; i <= normA.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= normB.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= normA.length; i++) {
    for (let j = 1; j <= normB.length; j++) {
      const cost = normA[i - 1] === normB[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const dist = matrix[normA.length][normB.length];
  const maxLen = Math.max(normA.length, normB.length);
  if (maxLen === 0) return 1.0;
  return 1 - dist / maxLen;
}

function tokenize(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1)
  );
}

function jaccardSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function fuzzyCompareLists(
  listA: string[],
  listB: string[],
  threshold: number = 0.65
): { fuzzyMatches: FuzzyMatch[]; unmatchedA: string[]; unmatchedB: string[] } {
  const usedB = new Set<number>();
  const fuzzyMatches: FuzzyMatch[] = [];

  for (let i = 0; i < listA.length; i++) {
    let bestMatch = -1;
    let bestScore = 0;
    let bestReason = "";

    for (let j = 0; j < listB.length; j++) {
      if (usedB.has(j)) continue;

      const normA = listA[i].toLowerCase().trim();
      const normB = listB[j].toLowerCase().trim();

      // Exact match
      if (normA === normB) {
        bestMatch = j;
        bestScore = 1.0;
        bestReason = "Exact match";
        break;
      }

      // Edit distance similarity
      const editScore = computeFuzzyScore(listA[i], listB[j]);

      // Token/Jaccard similarity (for reordered words: "John Smith" vs "Smith, John")
      const jaccardScore = jaccardSimilarity(listA[i], listB[j]);

      // Combined score
      const score = Math.max(editScore, jaccardScore);

      if (score > bestScore && score >= threshold) {
        bestScore = score;
        bestMatch = j;
        if (jaccardScore > editScore) {
          bestReason = "Similar tokens (reordered/matched words)";
        } else if (editScore >= 0.9) {
          bestReason = "Near-identical (minor typo/difference)";
        } else {
          bestReason = "Similar spelling/structure";
        }
      }
    }

    if (bestMatch >= 0) {
      fuzzyMatches.push({
        itemA: listA[i],
        itemB: listB[bestMatch],
        confidence: Math.round(bestScore * 100) / 100,
        reason: bestReason,
      });
      usedB.add(bestMatch);
    }
  }

  const unmatchedA = listA.filter((_, i) =>
    !fuzzyMatches.some((m) => m.itemA === listA[i] && m.itemB !== undefined)
  );
  // Items in A that didn't get matched
  const matchedAItems = new Set(fuzzyMatches.map((m) => m.itemA));
  const matchedBItems = new Set(fuzzyMatches.map((m) => m.itemB));

  const unmatchedAResult = listA.filter((item) => !matchedAItems.has(item));
  const unmatchedBResult = listB.filter((item) => !matchedBItems.has(item));

  return { fuzzyMatches, unmatchedA: unmatchedAResult, unmatchedB: unmatchedBResult };
}
