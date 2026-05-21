export interface ComparisonRecord {
  id: string;
  timestamp: number;
  listALength: number;
  listBLength: number;
  commonCount: number;
  uniqueACount: number;
  uniqueBCount: number;
  matchRate: number;
  mode: "exact" | "ai";
  preview: {
    onlyInA: string[];
    onlyInB: string[];
    inBoth: string[];
  };
}

const STORAGE_KEY = "comparelist_history";
const MAX_RECORDS = 20;

export function getHistory(): ComparisonRecord[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return entry;
}

export function deleteComparison(id: string): void {
  const history = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
