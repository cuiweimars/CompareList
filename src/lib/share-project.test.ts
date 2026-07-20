import { describe, expect, it } from "vitest";
import { buildSharedComparisonUrl, decodeSharedComparison, encodeSharedComparison, type SharedComparison } from "@/lib/share-project";

const shared: SharedComparison = {
  version: 1,
  mode: "smart",
  smartThreshold: 0.82,
  options: {
    caseSensitive: false,
    trimWhitespace: true,
    removeDuplicates: true,
    ignoreEmpty: true,
    delimiter: "auto",
    customDelimiter: "",
    normalization: "email",
  },
  listA: "张三@example.com\nAlice@example.com",
  listB: "alice@example.com",
};

describe("shared comparison", () => {
  it("round-trips unicode data", () => {
    expect(decodeSharedComparison(encodeSharedComparison(shared))).toEqual(shared);
  });

  it("keeps data in the URL fragment", () => {
    const url = new URL(buildSharedComparisonUrl("https://comparelist.org/en?source=test", shared));
    expect(url.search).toBe("?source=test");
    expect(url.hash.startsWith("#share=")).toBe(true);
    expect(url.pathname).toBe("/en");
  });

  it("rejects invalid payloads", () => {
    expect(() => decodeSharedComparison(encodeSharedComparison({ ...shared, version: 2 } as unknown as SharedComparison))).toThrow();
  });
});
