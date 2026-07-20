"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Database, ShieldCheck, X } from "lucide-react";
import { getWorkspaceCopy } from "@/lib/workspace-copy";

interface SaveProjectDialogProps {
  open: boolean;
  defaultName: string;
  defaultSaveContent?: boolean;
  onClose: () => void;
  onSave: (name: string, saveContent: boolean) => Promise<void> | void;
}

export default function SaveProjectDialog({
  open,
  defaultName,
  defaultSaveContent = false,
  onClose,
  onSave,
}: SaveProjectDialogProps) {
  const locale = useLocale();
  const copy = getWorkspaceCopy(locale);
  const [name, setName] = useState(defaultName);
  const [saveContent, setSaveContent] = useState(defaultSaveContent);
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => nameRef.current?.select(), 0);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [defaultName, defaultSaveContent, onClose, open]);

  if (!open) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onSave(name.trim(), saveContent);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-label={copy.close} onClick={onClose} />
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="save-project-title" className="relative w-full max-w-md rounded-2xl border border-border bg-[#0f1629] p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-primary" />
            <h2 id="save-project-title" className="font-semibold">{copy.saveProject}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={copy.close} className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt/60">
            <X size={17} />
          </button>
        </div>

        <label className="block text-sm text-text-secondary">
          <span className="block mb-1.5">{copy.projectName}</span>
          <input ref={nameRef} value={name} onChange={(event) => setName(event.target.value)} placeholder={copy.projectNamePlaceholder} maxLength={80} className="w-full min-h-11 rounded-xl border border-border bg-surface px-3 text-text outline-none focus:border-primary/60" />
        </label>

        <label className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4 cursor-pointer">
          <input type="checkbox" checked={saveContent} onChange={(event) => setSaveContent(event.target.checked)} className="mt-1 accent-primary" />
          <span>
            <span className="block text-sm font-medium">{copy.saveContent}</span>
            <span className="block mt-1 text-xs leading-relaxed text-text-muted">{copy.saveContentDescription}</span>
          </span>
        </label>

        <div className="mt-3 flex items-start gap-2 text-xs text-text-muted">
          <ShieldCheck size={14} className="text-success shrink-0" />
          <span>{saveContent ? copy.contentSaved : copy.settingsOnly} · {copy.localOnly}</span>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-border px-4 text-sm text-text-secondary hover:bg-surface-alt/50">{copy.cancel}</button>
          <button type="submit" disabled={!name.trim() || saving} className="btn-primary min-h-11 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "…" : copy.save}</button>
        </div>
      </form>
    </div>
  );
}
