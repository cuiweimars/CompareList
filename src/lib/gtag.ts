export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export function pageview(path: string) {
  if (GA_ID && typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_ID, { page_path: path });
  }
}

export function event(action: string, params: Record<string, string | number> = {}) {
  if (GA_ID && typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, params);
  }
}
