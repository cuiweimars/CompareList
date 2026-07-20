export const SUPPORTED_FILE_EXTENSIONS = [".txt", ".csv", ".tsv", ".xlsx", ".xls", ".xlsm", ".ods"] as const;

export interface ParsedSheet {
  name: string;
  data: string[][];
}

export interface ParsedFile {
  extension: string;
  encoding?: string;
  delimiter?: string | null;
  text?: string;
  sheets: ParsedSheet[];
}

export type SupportedTextEncoding = "utf-8" | "utf-16le" | "utf-16be" | "gb18030";

export interface ParseFileOptions {
  encoding?: SupportedTextEncoding;
  delimiter?: "auto" | "," | ";" | "\t" | "|";
}

function extensionOf(fileName: string): string {
  const extension = fileName.includes(".") ? `.${fileName.split(".").pop()?.toLowerCase()}` : "";
  return extension;
}

export function isSupportedFileName(fileName: string): boolean {
  return (SUPPORTED_FILE_EXTENSIONS as readonly string[]).includes(extensionOf(fileName));
}

function decodeBytes(bytes: Uint8Array, forcedEncoding?: SupportedTextEncoding): { text: string; encoding: string } {
  if (forcedEncoding) {
    const text = new TextDecoder(forcedEncoding).decode(bytes).replace(/^\uFEFF/, "");
    return { text, encoding: forcedEncoding.toUpperCase().replace("UTF-16LE", "UTF-16LE").replace("UTF-16BE", "UTF-16BE") };
  }
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return { text: new TextDecoder("utf-8").decode(bytes.subarray(3)), encoding: "UTF-8" };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return { text: new TextDecoder("utf-16le").decode(bytes.subarray(2)), encoding: "UTF-16LE" };
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    const swapped = new Uint8Array(bytes.length - 2);
    for (let index = 2; index + 1 < bytes.length; index += 2) {
      swapped[index - 2] = bytes[index + 1];
      swapped[index - 1] = bytes[index];
    }
    return { text: new TextDecoder("utf-16le").decode(swapped), encoding: "UTF-16BE" };
  }

  try {
    return { text: new TextDecoder("utf-8", { fatal: true }).decode(bytes), encoding: "UTF-8" };
  } catch {
    try {
      return { text: new TextDecoder("gb18030", { fatal: true }).decode(bytes), encoding: "GB18030" };
    } catch {
      return { text: new TextDecoder().decode(bytes), encoding: "UTF-8" };
    }
  }
}

function delimiterScore(sample: string, delimiter: string): number {
  let score = 0;
  let inQuotes = false;
  const lines = sample.split(/\r?\n/).slice(0, 20);
  for (const line of lines) {
    let count = 0;
    for (let index = 0; index < line.length; index++) {
      if (line[index] === '"') {
        if (inQuotes && line[index + 1] === '"') index += 1;
        else inQuotes = !inQuotes;
      } else if (!inQuotes && line[index] === delimiter) {
        count += 1;
      }
    }
    if (count > 0) score += count;
  }
  return score;
}

export function detectDelimiter(text: string, extension = ""): string | null {
  if (extension === ".tsv") return "\t";
  const candidates = extension === ".csv" ? [",", ";", "\t", "|"] : ["\t", ",", ";", "|"];
  const scores = candidates.map((delimiter) => ({ delimiter, score: delimiterScore(text.slice(0, 64_000), delimiter) }));
  scores.sort((left, right) => right.score - left.score);
  return scores[0].score > 0 ? scores[0].delimiter : null;
}

export function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += character;
      }
    } else if (character === '"') {
      inQuotes = true;
    } else if (character === delimiter) {
      fields.push(current.trim());
      current = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      fields.push(current.trim());
      if (fields.some(Boolean)) rows.push(fields);
      fields = [];
      current = "";
    } else {
      current += character;
    }
  }
  fields.push(current.trim());
  if (fields.some(Boolean)) rows.push(fields);
  if (rows[0]?.[0]) rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");
  return rows;
}

export async function parseSupportedFile(file: File, options: ParseFileOptions = {}): Promise<ParsedFile> {
  const extension = extensionOf(file.name);
  if (!isSupportedFileName(file.name)) throw new Error("unsupported-file-type");

  if ([".xlsx", ".xls", ".xlsm", ".ods"].includes(extension)) {
    const XLSX = await import("@e965/xlsx");
    const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true, dense: true });
    const sheets = workbook.SheetNames.map((name) => ({
      name,
      data: XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[name], {
        header: 1,
        defval: "",
        raw: false,
        blankrows: false,
      }).map((row) => row.map((cell) => cell instanceof Date ? cell.toISOString() : String(cell ?? ""))),
    }));
    return { extension, sheets };
  }

  const decoded = decodeBytes(new Uint8Array(await file.arrayBuffer()), options.encoding);
  const delimiter = options.delimiter && options.delimiter !== "auto"
    ? options.delimiter
    : detectDelimiter(decoded.text, extension);
  const data = delimiter
    ? parseDelimited(decoded.text, delimiter)
    : decoded.text.split(/\r?\n/).filter((line) => line.trim().length > 0).map((line) => [line]);
  return {
    extension,
    encoding: decoded.encoding,
    delimiter,
    text: decoded.text,
    sheets: [{ name: file.name, data }],
  };
}
