import { describe, expect, it } from "vitest";
import { detectDelimiter, isSupportedFileName, parseDelimited } from "@/lib/file-parsers";

describe("file parsers", () => {
  it("detects common delimiters", () => {
    expect(detectDelimiter("id;name\n1;Alice\n2;Bob", ".csv")).toBe(";");
    expect(detectDelimiter("id\tname\n1\tAlice", ".tsv")).toBe("\t");
  });

  it("parses quoted delimiters and escaped quotes", () => {
    expect(parseDelimited('id,name\r\n1,"Smith, John"\r\n2,"A ""quoted"" value"', ",")).toEqual([
      ["id", "name"],
      ["1", "Smith, John"],
      ["2", 'A "quoted" value'],
    ]);
  });

  it("supports spreadsheet and text formats", () => {
    for (const extension of ["txt", "csv", "tsv", "xlsx", "xls", "xlsm", "ods"]) {
      expect(isSupportedFileName(`sample.${extension}`)).toBe(true);
    }
    expect(isSupportedFileName("sample.pdf")).toBe(false);
  });
});
