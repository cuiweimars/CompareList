import { describe, expect, it } from "vitest";
import { compareTables, suggestColumnMappings, suggestKeyColumns, type TableData } from "@/lib/table-compare";

const a: TableData = {
  headers: ["id", "name", "status"],
  rows: [["1", "Alice", "active"], ["2", "Bob", "active"], ["3", "Chris", "old"]],
};
const b: TableData = {
  headers: ["id", "name", "status"],
  rows: [["1", "Alice", "active"], ["2", "Bob", "paused"], ["4", "Dana", "active"]],
};

describe("compareTables", () => {
  it("classifies added, removed, changed, and unchanged rows", () => {
    const result = compareTables(a, b, [0], [0]);
    expect(result.stats).toMatchObject({ added: 1, removed: 1, changed: 1, unchanged: 1 });
    expect(result.changed[0].changes).toEqual([{ column: "status", before: "active", after: "paused" }]);
  });

  it("supports composite keys and normalized values", () => {
    const first = { headers: ["first", "last", "value"], rows: [["John", "Smith", "A"]] };
    const second = { headers: ["first", "last", "value"], rows: [["john", "smith", "A"]] };
    expect(compareTables(first, second, [0, 1], [0, 1]).stats.unchanged).toBe(1);
  });

  it("reports duplicate key rows", () => {
    const duplicated = { ...a, rows: [...a.rows, ["1", "Alice 2", "active"]] };
    expect(compareTables(duplicated, b, [0], [0]).stats.duplicateKeysA).toBe(1);
  });

  it("maps renamed and reordered columns", () => {
    const first = { headers: ["customer_id", "full name", "status"], rows: [["1", "Alice", "active"]] };
    const second = { headers: ["Status", "Customer ID", "Full-Name"], rows: [["active", "1", "Alice"]] };
    const mappings = suggestColumnMappings(first, second);
    const result = compareTables(first, second, [0], [1], {}, { columnMappings: mappings });
    expect(mappings).toEqual([{ indexA: 0, indexB: 1 }, { indexA: 1, indexB: 2 }, { indexA: 2, indexB: 0 }]);
    expect(result.stats.unchanged).toBe(1);
  });

  it("applies numeric, date, empty, and punctuation rules", () => {
    const first = { headers: ["id", "amount", "date", "note", "empty"], rows: [["1", "10.00", "2026-07-20", "Ready!", "N/A"]] };
    const second = { headers: ["id", "amount", "date", "note", "empty"], rows: [["1", "10.04", "2026-07-20T00:00:00Z", "Ready", ""]] };
    const result = compareTables(first, second, [0], [0], {}, {
      columnMappings: suggestColumnMappings(first, second),
      numericTolerance: 0.05,
      normalizeDates: true,
      emptyValuesEqual: true,
      ignorePunctuation: true,
    });
    expect(result.stats.unchanged).toBe(1);
  });

  it("recommends a complete unique identifier column", () => {
    expect(suggestKeyColumns(a)).toEqual([0]);
  });

  it("respects an explicit choice to ignore every non-key column", () => {
    const result = compareTables(a, b, [0], [0], {}, { columnMappings: [] });
    expect(result.stats.changed).toBe(0);
    expect(result.stats.unchanged).toBe(2);
  });
});
