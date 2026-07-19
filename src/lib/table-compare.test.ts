import { describe, expect, it } from "vitest";
import { compareTables, type TableData } from "@/lib/table-compare";

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
});
