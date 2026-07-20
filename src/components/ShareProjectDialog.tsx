"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Link2, ShieldAlert, X } from "lucide-react";
import { useLocale } from "next-intl";
import type { CompareUiOptions } from "@/lib/compare";
import { buildSharedComparisonUrl, MAX_SHARE_URL_LENGTH, type SharedComparison } from "@/lib/share-project";
import { copyToClipboard } from "@/lib/export";
import { getWorkspaceCopy } from "@/lib/workspace-copy";
import { event as trackEvent } from "@/lib/gtag";

interface Props {
  listA: string;
  listB: string;
  mode: "exact" | "smart";
  smartThreshold: number;
  options: CompareUiOptions;
  onClose: () => void;
}

export default function ShareProjectDialog({ listA, listB, mode, smartThreshold, options, onClose }: Props) {
  const copy = getWorkspaceCopy(useLocale());
  const [includeContent, setIncludeContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const payload = useMemo<SharedComparison>(() => ({
    version: 1,
    mode,
    smartThreshold,
    options,
    ...(includeContent ? { listA, listB } : {}),
  }), [includeContent, listA, listB, mode, options, smartThreshold]);
  const url = typeof window === "undefined" ? "" : buildSharedComparisonUrl(window.location.href, payload);
  const tooLarge = url.length > MAX_SHARE_URL_LENGTH;

  useEffect(() => {
    closeRef.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleCopy() {
    if (tooLarge || !(await copyToClipboard(url))) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    trackEvent("comparison_share_link_copied", { content_included: includeContent ? 1 : 0, url_size_bucket: url.length <= 2000 ? "small" : "large" });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="share-project-title" className="w-full max-w-lg rounded-2xl border border-border bg-[#0f1629] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="share-project-title" className="flex items-center gap-2 text-lg font-semibold"><Link2 size={18} className="text-primary" /> {copy.shareProject}</h2>
            <p className="mt-1 text-sm text-text-secondary">{copy.shareDialogDescription}</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt/50" aria-label={copy.close}><X size={17} /></button>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface/40 p-4">
          <input type="checkbox" checked={includeContent} onChange={(event) => setIncludeContent(event.target.checked)} className="mt-1 accent-primary" />
          <span>
            <span className="block text-sm font-medium text-text">{copy.includeShareContent}</span>
            <span className="mt-1 block text-xs leading-relaxed text-text-muted">{includeContent ? copy.sharePrivacyWarning : copy.shareRulesOnly}</span>
          </span>
        </label>

        {includeContent && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-500">
            <ShieldAlert size={15} className="mt-0.5 shrink-0" /> {copy.sharePrivacyWarning}
          </div>
        )}
        {tooLarge && <p role="alert" className="mt-3 text-xs text-danger">{copy.shareTooLarge}</p>}
        <p className="mt-3 text-xs text-text-muted">{url.length.toLocaleString()} / {MAX_SHARE_URL_LENGTH.toLocaleString()} characters</p>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-border px-4 text-sm text-text-secondary hover:bg-surface-alt/50">{copy.cancel}</button>
          <button type="button" onClick={handleCopy} disabled={tooLarge} className="btn-primary min-h-11 inline-flex items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50">
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? copy.shareCopied : copy.copyShareLink}
          </button>
        </div>
      </div>
    </div>
  );
}
