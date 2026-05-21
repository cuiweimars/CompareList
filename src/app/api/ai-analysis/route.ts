import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

interface CompareContext {
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
  stats: { totalA: number; totalB: number; common: number; matchRate: number };
  fuzzyMatches: { itemA: string; itemB: string; confidence: number; reason: string }[];
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { onlyInA, onlyInB, inBoth, stats, fuzzyMatches } = body as CompareContext;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      insights: generateFallbackInsights(body),
      aiPowered: false,
    });
  }

  const systemPrompt = `You are a data analysis assistant. You analyze the results of comparing two lists and provide clear, actionable insights. Keep your response concise (3-5 sentences max). Write in English. Be specific about numbers and patterns you observe.`;

  const userPrompt = `Analyze this list comparison result:
- List A: ${stats.totalA} items, List B: ${stats.totalB} items
- Exact matches: ${inBoth.length} items (${stats.matchRate}% match rate)
- Only in List A: ${onlyInA.length} items: ${onlyInA.slice(0, 10).join(", ")}${onlyInA.length > 10 ? "..." : ""}
- Only in List B: ${onlyInB.length} items: ${onlyInB.slice(0, 10).join(", ")}${onlyInB.length > 10 ? "..." : ""}
- Common items: ${inBoth.slice(0, 10).join(", ")}${inBoth.length > 10 ? "..." : ""}
${fuzzyMatches.length > 0 ? `- Fuzzy matches found: ${fuzzyMatches.map((m) => `"${m.itemA}" ~ "${m.itemB}" (${Math.round(m.confidence * 100)}%)`).join(", ")}` : ""}

Provide a brief analysis: What patterns do you see? What type of data is this? Any actionable observations?`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { insights: generateFallbackInsights(body), aiPowered: false },
        { status: 200 }
      );
    }

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content || generateFallbackInsights(body);

    return NextResponse.json({ insights, aiPowered: true });
  } catch {
    return NextResponse.json({
      insights: generateFallbackInsights(body),
      aiPowered: false,
    });
  }
}

function generateFallbackInsights(ctx: CompareContext): string {
  let text = `Compared ${ctx.stats.totalA} items in List A with ${ctx.stats.totalB} items in List B. `;
  text += `Found ${ctx.inBoth.length} exact matches (${ctx.stats.matchRate}% match rate). `;
  if (ctx.fuzzyMatches.length > 0) {
    text += `Additionally found ${ctx.fuzzyMatches.length} fuzzy matches that exact comparison missed. `;
  }
  if (ctx.onlyInA.length > 0) {
    text += `${ctx.onlyInA.length} items are unique to List A. `;
  }
  if (ctx.onlyInB.length > 0) {
    text += `${ctx.onlyInB.length} items are unique to List B. `;
  }
  return text.trim();
}
