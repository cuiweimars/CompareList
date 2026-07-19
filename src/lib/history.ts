export interface ComparisonRecord {
  id: string;
  timestamp: number;
  listALength: number;
  listBLength: number;
  commonCount: number;
  uniqueACount: number;
  uniqueBCount: number;
  matchRate: number;
  mode: "exact" | "smart";
  preview?: {
    onlyInA: string[];
    onlyInB: string[];
    inBoth: string[];
  };
}

const STORAGE_KEY = "comparelist_history";
const MAX_RECORDS = 20;

export function getHistory(): ComparisonRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is ComparisonRecord => Boolean(item && typeof item === "object"))
      .map((item) => ({ ...item, mode: item.mode === "smart" ? "smart" : "exact" }));
  } catch {
    return [];
  }
}

export function saveComparison(record: Omit<ComparisonRecord, "id" | "timestamp">): ComparisonRecord {
  const history = getHistory();
  const entry: ComparisonRecord = {
    ...record,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(),
  };
  history.unshift(entry);
  if (history.length > MAX_RECORDS) {
    history.length = MAX_RECORDS;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Comparisons still work when storage is disabled or full.
  }
  return entry;
}

export function deleteComparison(id: string): void {
  const history = getHistory().filter((h) => h.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore unavailable storage.
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
