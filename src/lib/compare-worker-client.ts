import { compareLists, type CompareResult, type CompareUiOptions } from "@/lib/compare";
import { smartCompareLists, type SmartCompareResult } from "@/lib/ai-compare";

interface RunComparisonOptions {
  listA: string;
  listB: string;
  options: CompareUiOptions;
  mode: "exact" | "smart";
  smartThreshold: number;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

interface ComparisonOutput {
  result: CompareResult;
  smartResult: SmartCompareResult | null;
}

interface WorkerMessage {
  id: string;
  type: "progress" | "complete" | "error";
  progress?: number;
  result?: CompareResult;
  smartResult?: SmartCompareResult | null;
  message?: string;
}

function runOnMainThread(request: RunComparisonOptions): ComparisonOutput {
  request.onProgress?.(25);
  const result = compareLists(request.listA, request.listB, request.options);
  request.onProgress?.(request.mode === "smart" ? 55 : 100);
  const smartResult = request.mode === "smart"
    ? smartCompareLists(request.listA, request.listB, request.options, request.smartThreshold)
    : null;
  request.onProgress?.(100);
  return { result, smartResult };
}

export function runComparisonInWorker(request: RunComparisonOptions): Promise<ComparisonOutput> {
  if (typeof Worker === "undefined") return Promise.resolve(runOnMainThread(request));

  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const worker = new Worker(new URL("../workers/compare.worker.ts", import.meta.url), { type: "module" });
    const cleanup = () => {
      request.signal?.removeEventListener("abort", abort);
      worker.terminate();
    };
    const abort = () => {
      cleanup();
      reject(new DOMException("Comparison cancelled", "AbortError"));
    };
    request.signal?.addEventListener("abort", abort, { once: true });
    worker.onerror = () => {
      cleanup();
      try {
        resolve(runOnMainThread(request));
      } catch (error) {
        reject(error);
      }
    };
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.id !== id) return;
      if (message.type === "progress") {
        request.onProgress?.(message.progress ?? 0);
        return;
      }
      cleanup();
      if (message.type === "error") {
        reject(new Error(message.message || "Comparison failed"));
      } else if (message.result) {
        resolve({ result: message.result, smartResult: message.smartResult ?? null });
      } else {
        reject(new Error("Comparison returned no result"));
      }
    };
    worker.postMessage({
      id,
      listA: request.listA,
      listB: request.listB,
      options: request.options,
      mode: request.mode,
      smartThreshold: request.smartThreshold,
    });
  });
}
