export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event",
      target: string,
      params?: Record<string, string | number>
    ) => void;
  }
}

export function pageview(path: string) {
  if (GA_ID && typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_ID, { page_path: path });
  }
}

export function event(action: string, params: Record<string, string | number> = {}) {
  if (GA_ID && typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
}

export function itemCountBucket(count: number): string {
  if (count <= 0) return "0";
  if (count <= 10) return "1-10";
  if (count <= 100) return "11-100";
  if (count <= 1_000) return "101-1000";
  if (count <= 10_000) return "1001-10000";
  return "10000+";
}

export function fileSizeBucket(bytes: number): string {
  if (bytes < 100 * 1024) return "under-100kb";
  if (bytes < 1024 * 1024) return "100kb-1mb";
  if (bytes < 10 * 1024 * 1024) return "1mb-10mb";
  return "10mb+";
}
