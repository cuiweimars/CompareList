import type { CompareResult, CompareUiOptions } from "@/lib/compare";
import type { SmartCompareResult } from "@/lib/ai-compare";
import type { TableData } from "@/lib/table-compare";

export type ProjectMode = "exact" | "smart";

export interface LocalCompareProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  lastComparedAt: number;
  pinned: boolean;
  saveContent: boolean;
  listA: string;
  listB: string;
  labelA: string;
  labelB: string;
  mode: ProjectMode;
  smartThreshold: number;
  options: CompareUiOptions;
  result: CompareResult | null;
  smartResult: SmartCompareResult | null;
  rejectedFuzzyMatches: string[];
  tableA: TableData | null;
  tableB: TableData | null;
}

export interface ProjectDraft {
  id?: string;
  name: string;
  saveContent: boolean;
  pinned?: boolean;
  listA: string;
  listB: string;
  labelA?: string;
  labelB?: string;
  mode: ProjectMode;
  smartThreshold: number;
  options: CompareUiOptions;
  result: CompareResult | null;
  smartResult: SmartCompareResult | null;
  rejectedFuzzyMatches?: string[];
  tableA?: TableData | null;
  tableB?: TableData | null;
}

const DB_NAME = "comparelist-workspace";
const DB_VERSION = 1;
const STORE_NAME = "projects";
const FALLBACK_KEY = "comparelist_projects_v1";
const MAX_FALLBACK_PROJECTS = 30;
export const PROJECTS_CHANGED_EVENT = "comparelist:projects-changed";

function createId(): string {
  return `${Date.now().toString(36)}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

function notifyChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PROJECTS_CHANGED_EVENT));
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
        store.createIndex("pinned", "pinned");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open project database"));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore, resolve: (value: T) => void, reject: (reason?: unknown) => void) => void,
): Promise<T> {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Project database transaction failed"));
    };
    run(store, resolve, reject);
  });
}

function readFallback(): LocalCompareProject[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FALLBACK_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isLocalCompareProject) : [];
  } catch {
    return [];
  }
}

function writeFallback(projects: LocalCompareProject[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(projects.slice(0, MAX_FALLBACK_PROJECTS)));
}

export function isLocalCompareProject(value: unknown): value is LocalCompareProject {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<LocalCompareProject>;
  return typeof project.id === "string"
    && typeof project.name === "string"
    && typeof project.updatedAt === "number"
    && (project.mode === "exact" || project.mode === "smart")
    && Boolean(project.options && typeof project.options === "object");
}

function sortProjects(projects: LocalCompareProject[]): LocalCompareProject[] {
  return projects.sort((left, right) => Number(right.pinned) - Number(left.pinned) || right.updatedAt - left.updatedAt);
}

export async function listProjects(): Promise<LocalCompareProject[]> {
  try {
    const projects = await withStore<LocalCompareProject[]>("readonly", (store, resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.filter(isLocalCompareProject));
      request.onerror = () => reject(request.error);
    });
    return sortProjects(projects);
  } catch {
    return sortProjects(readFallback());
  }
}

export async function getProject(id: string): Promise<LocalCompareProject | null> {
  try {
    return await withStore<LocalCompareProject | null>("readonly", (store, resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(isLocalCompareProject(request.result) ? request.result : null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return readFallback().find((project) => project.id === id) ?? null;
  }
}

export async function saveProject(draft: ProjectDraft): Promise<LocalCompareProject> {
  const existing = draft.id ? await getProject(draft.id) : null;
  const now = Date.now();
  const project: LocalCompareProject = {
    id: existing?.id ?? createId(),
    name: draft.name.trim() || "Untitled comparison",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastComparedAt: now,
    pinned: draft.pinned ?? existing?.pinned ?? false,
    saveContent: draft.saveContent,
    listA: draft.saveContent ? draft.listA : "",
    listB: draft.saveContent ? draft.listB : "",
    labelA: draft.labelA || "List A",
    labelB: draft.labelB || "List B",
    mode: draft.mode,
    smartThreshold: draft.smartThreshold,
    options: draft.options,
    result: draft.saveContent ? draft.result : draft.result ? {
      onlyInA: [],
      onlyInB: [],
      inBoth: [],
      stats: draft.result.stats,
    } : null,
    smartResult: draft.saveContent ? draft.smartResult : null,
    rejectedFuzzyMatches: draft.saveContent ? draft.rejectedFuzzyMatches ?? [] : [],
    tableA: draft.saveContent ? draft.tableA ?? null : null,
    tableB: draft.saveContent ? draft.tableB ?? null : null,
  };

  try {
    await withStore<void>("readwrite", (store, resolve, reject) => {
      const request = store.put(project);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const projects = readFallback().filter((item) => item.id !== project.id);
    projects.unshift(project);
    writeFallback(projects);
  }
  notifyChanged();
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await withStore<void>("readwrite", (store, resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    writeFallback(readFallback().filter((project) => project.id !== id));
  }
  notifyChanged();
}

export async function setProjectPinned(id: string, pinned: boolean): Promise<void> {
  const project = await getProject(id);
  if (!project) return;
  project.pinned = pinned;
  project.updatedAt = Date.now();
  await saveProject({ ...project, id: project.id, saveContent: project.saveContent });
}

export async function clearProjects(): Promise<void> {
  try {
    await withStore<void>("readwrite", (store, resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    writeFallback([]);
  }
  notifyChanged();
}

export function exportProject(project: LocalCompareProject): void {
  const payload = JSON.stringify({ format: "comparelist-project", version: 1, project }, null, 2);
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${project.name.replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/^-|-$/g, "") || "comparison"}.comparelist`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importProject(file: File): Promise<LocalCompareProject> {
  const parsed: unknown = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid project file");
  const container = parsed as { format?: unknown; version?: unknown; project?: unknown };
  if (container.format !== "comparelist-project" || container.version !== 1 || !isLocalCompareProject(container.project)) {
    throw new Error("Invalid project file");
  }
  const imported = container.project;
  return saveProject({
    ...imported,
    id: undefined,
    name: imported.name,
    saveContent: imported.saveContent,
  });
}
