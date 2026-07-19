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
