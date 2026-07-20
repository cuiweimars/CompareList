import type { CompareUiOptions } from "@/lib/compare";

export const MAX_SHARE_URL_LENGTH = 8_000;

export interface SharedComparison {
  version: 1;
  mode: "exact" | "smart";
  smartThreshold: number;
  options: CompareUiOptions;
  listA?: string;
  listB?: string;
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

export function encodeSharedComparison(payload: SharedComparison): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeSharedComparison(encoded: string): SharedComparison {
  const parsed: unknown = JSON.parse(fromBase64Url(encoded));
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid shared comparison");
  const value = parsed as Partial<SharedComparison>;
  if (
    value.version !== 1
    || (value.mode !== "exact" && value.mode !== "smart")
    || typeof value.smartThreshold !== "number"
    || !value.options
    || typeof value.options !== "object"
    || (value.listA !== undefined && typeof value.listA !== "string")
    || (value.listB !== undefined && typeof value.listB !== "string")
  ) throw new Error("Invalid shared comparison");
  if ((value.listA?.length ?? 0) + (value.listB?.length ?? 0) > 50_000) throw new Error("Shared comparison is too large");
  return value as SharedComparison;
}

export function buildSharedComparisonUrl(baseUrl: string, payload: SharedComparison): string {
  const url = new URL(baseUrl);
  url.hash = `share=${encodeSharedComparison(payload)}`;
  return url.toString();
}
