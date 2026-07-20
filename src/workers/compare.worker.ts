/// <reference lib="webworker" />

import { compareLists, type CompareResult, type CompareUiOptions } from "@/lib/compare";
import { smartCompareLists, type SmartCompareResult } from "@/lib/ai-compare";

interface CompareWorkerRequest {
  id: string;
  listA: string;
  listB: string;
  options: CompareUiOptions;
  mode: "exact" | "smart";
  smartThreshold: number;
}

type CompareWorkerResponse =
  | { id: string; type: "progress"; progress: number }
  | { id: string; type: "complete"; result: CompareResult; smartResult: SmartCompareResult | null }
  | { id: string; type: "error"; message: string };

self.onmessage = (event: MessageEvent<CompareWorkerRequest>) => {
  const request = event.data;
  const send = (message: CompareWorkerResponse) => self.postMessage(message);
  try {
    send({ id: request.id, type: "progress", progress: 15 });
    const result = compareLists(request.listA, request.listB, request.options);
    send({ id: request.id, type: "progress", progress: request.mode === "smart" ? 45 : 90 });
    const smartResult = request.mode === "smart"
      ? smartCompareLists(request.listA, request.listB, request.options, request.smartThreshold)
      : null;
    send({ id: request.id, type: "progress", progress: 100 });
    send({ id: request.id, type: "complete", result, smartResult });
  } catch (error) {
    send({ id: request.id, type: "error", message: error instanceof Error ? error.message : "Comparison failed" });
  }
};

export {};
