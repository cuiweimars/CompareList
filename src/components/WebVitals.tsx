"use client";

import { useReportWebVitals } from "next/web-vitals";
import { event } from "@/lib/gtag";

function reportMetric(metric: Parameters<Parameters<typeof useReportWebVitals>[0]>[0]) {
  event("web_vital", {
    metric_name: metric.name,
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    rating: metric.rating,
    navigation_type: metric.navigationType,
  });
}

export default function WebVitals() {
  useReportWebVitals(reportMetric);
  return null;
}
