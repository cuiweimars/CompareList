import { describe, expect, it } from "vitest";
import { analyzeList, compareLists, normalizeItem, parseList } from "@/lib/compare";
import { fuzzyCompareLists, smartCompareLists } from "@/lib/ai-compare";

describe("parseList", () => {
  it("preserves commas inside items when the input has multiple lines", () => {
    expect(parseList("John Smith\nSmith, John\nJane Doe")).toEqual([
      "John Smith",
      "Smith, John",
      "Jane Doe",
    ]);
  });

  it("auto-detects comma-separated single-line input", () => {
    expect(parseList("apple,banana,cherry")).toEqual(["apple", "banana", "cherry"]);
  });

  it("honors whitespace and empty-item options", () => {
    expect(parseList(" first \n\n second ", {
      delimiter: "newline",
      trimWhitespace: false,
      ignoreEmpty: false,
    })).toEqual([" first ", "", " second "]);
  });

  it("supports a custom delimiter", () => {
    expect(parseList("one||two||three", { delimiter: "custom", customDelimiter: "||" })).toEqual([
      "one",
      "two",
      "three",
    ]);
  });
});

describe("compareLists", () => {
  it("reports duplicates, empty items, and invalid typed values", () => {
    expect(analyzeList("a@example.com\na@example.com\ninvalid\n", {
      delimiter: "newline",
      normalization: "email",
    })).toMatchObject({ duplicateCount: 1, emptyCount: 1, invalidCount: 1 });
  });

  it("uses one-to-one multiset semantics when duplicates are kept", () => {
    const result = compareLists("a\na\nb", "a\nb\nb", {
      delimiter: "newline",
      removeDuplicates: false,
    });
    expect(result.inBoth).toEqual(["a", "b"]);
    expect(result.onlyInA).toEqual(["a"]);
    expect(result.onlyInB).toEqual(["b"]);
    expect(result.stats).toMatchObject({ totalA: 3, totalB: 3, common: 2, matchRate: 67 });
  });

  it("normalizes email addresses", () => {
    expect(compareLists("Info@Example.com", "info@example.com", { normalization: "email" }).stats.common).toBe(1);
  });

  it("normalizes phone formatting", () => {
    expect(compareLists("+1 (555) 123-4567", "+15551234567", { normalization: "phone" }).stats.common).toBe(1);
    expect(normalizeItem("0044 20 1234 5678", { normalization: "phone", defaultCountryCode: "+1" })).toBe("442012345678");
  });

  it("normalizes common URL presentation differences", () => {
    expect(compareLists("https://www.Example.com/path/", "http://example.com/path", { normalization: "url" }).stats.common).toBe(1);
  });

  it("normalizes IPv4 leading zeros", () => {
    expect(normalizeItem("192.168.001.010", { normalization: "ip" })).toBe("192.168.1.10");
  });

  it("can ignore name token order and diacritics", () => {
    const result = compareLists("José Silva", "Silva, Jose", {
      delimiter: "newline",
      normalization: "name",
      ignoreDiacritics: true,
      reorderNameTokens: true,
    });
    expect(result.stats.common).toBe(1);
  });
});

describe("smart matching", () => {
  it("finds reordered names without sending data to a server", () => {
    const result = smartCompareLists("John Smith\nAlice", "Smith, John\nAlyce", { delimiter: "newline" }, 0.7);
    expect(result.fuzzyMatches).toHaveLength(2);
    expect(result.stats.totalMatchRate).toBe(100);
  });

  it("keeps fuzzy matching one-to-one", () => {
    const result = fuzzyCompareLists(["alpha", "alphi"], ["alpha"], 0.7);
    expect(result.fuzzyMatches).toHaveLength(1);
    expect(result.unmatchedA).toEqual(["alphi"]);
  });
});
