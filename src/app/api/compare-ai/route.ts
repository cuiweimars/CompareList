import { NextRequest, NextResponse } from "next/server";
import { fuzzyCompareLists } from "@/lib/ai-compare";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { listA, listB, threshold = 0.65 } = body;

  if (!Array.isArray(listA) || !Array.isArray(listB)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (listA.length === 0 && listB.length === 0) {
    return NextResponse.json({ error: "Both lists are empty" }, { status: 400 });
  }

  const { fuzzyMatches, unmatchedA, unmatchedB } = fuzzyCompareLists(listA, listB, threshold);

  const exactMatches = fuzzyMatches.filter((m) => m.confidence === 1.0);
  const fuzzyOnly = fuzzyMatches.filter((m) => m.confidence < 1.0);

  const totalA = listA.length;
  const totalB = listB.length;
  const totalMatches = fuzzyMatches.length;
  const totalMatchRate =
    totalA + totalB > 0
      ? Math.round((2 * totalMatches * 100) / (totalA + totalB))
      : 0;

  const inBoth = exactMatches.map((m) => m.itemA);

  let insights = `Compared ${totalA} items in List A with ${totalB} items in List B. `;
  insights += `Found ${exactMatches.length} exact matches and ${fuzzyOnly.length} fuzzy matches. `;
  if (fuzzyOnly.length > 0) {
    insights += `Fuzzy matches include items with minor differences like typos, reordered words, or partial text overlap. `;
  }
  if (unmatchedA.length > 0) {
    insights += `${unmatchedA.length} items in List A had no match in List B. `;
  }
  if (unmatchedB.length > 0) {
    insights += `${unmatchedB.length} items in List B had no match in List A. `;
  }
  insights += `Overall match rate: ${totalMatchRate}%.`;

  return NextResponse.json({
    fuzzyMatches: fuzzyOnly,
    onlyInA: unmatchedA,
    onlyInB: unmatchedB,
    inBoth,
    insights,
    stats: {
      exactMatches: exactMatches.length,
      fuzzyMatches: fuzzyOnly.length,
      totalMatchRate,
    },
  });
}
