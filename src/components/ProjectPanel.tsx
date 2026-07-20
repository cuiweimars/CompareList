"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Download, FileText, FolderClock, Pin, PinOff, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import {
  clearProjects,
  deleteProject,
  exportProject,
  importProject,
  listProjects,
  PROJECTS_CHANGED_EVENT,
  setProjectPinned,
  type LocalCompareProject,
} from "@/lib/project-store";
import { getWorkspaceCopy } from "@/lib/workspace-copy";
import { event } from "@/lib/gtag";

interface ProjectPanelProps {
  open: boolean;
  onClose: () => void;
  onOpenProject: (project: LocalCompareProject) => void;
}

export default function ProjectPanel({ open, onClose, onOpenProject }: ProjectPanelProps) {
  const locale = useLocale();
  const copy = getWorkspaceCopy(locale);
  const [projects, setProjects] = useState<LocalCompareProject[]>([]);
  const [importError, setImportError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => setProjects(await listProjects()), []);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => void refresh());
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener(PROJECTS_CHANGED_EVENT, refresh);
    document.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener(PROJECTS_CHANGED_EVENT, refresh);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose, open, refresh]);

  if (!open) return null;

  async function handleImport(file: File) {
    setImportError(false);
    try {
      await importProject(file);
      event("project_imported", { content_saved: 1 });
      await refresh();
    } catch {
      setImportError(true);
      event("project_import_failed");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  function formatDate(timestamp: number) {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(timestamp);
  }

  return (
    <div className="fixed inset-0 z-[70] flex">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label={copy.close} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-panel-title"
        className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[#0f1629] shadow-2xl flex flex-col border-l border-border"
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FolderClock size={18} className="text-primary" />
              <h2 id="project-panel-title" className="font-semibold text-base">{copy.projects}</h2>
              <span className="text-xs text-text-muted">({projects.length})</span>
            </div>
            <p className="mt-1 text-xs text-text-muted">{copy.localOnly}</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label={copy.close} className="w-11 h-11 inline-flex items-center justify-center rounded-xl hover:bg-surface-alt/60">
            <X size={18} />
          </button>
        </header>

        <div className="px-5 py-3 border-b border-border bg-success/5 text-xs text-text-secondary flex items-start gap-2">
          <ShieldCheck size={15} className="text-success shrink-0 mt-0.5" />
          <span>{copy.projectsDescription}</span>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border">
          <button type="button" onClick={() => importRef.current?.click()} className="min-h-10 inline-flex items-center gap-2 rounded-lg border border-border px-3 text-xs text-text-secondary hover:text-text hover:bg-surface-alt/40">
            <Upload size={14} /> {copy.importProject}
          </button>
          <input ref={importRef} type="file" accept=".comparelist,application/json" className="hidden" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleImport(file);
          }} />
          {projects.length > 0 && (
            <button type="button" onClick={async () => { if (!window.confirm(copy.confirmClearProjects)) return; await clearProjects(); await refresh(); }} className="min-h-10 px-2 text-xs text-danger hover:underline">
              {copy.clearAll}
            </button>
          )}
        </div>

        {importError && <p role="alert" className="mx-5 mt-3 rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-danger">{copy.importFailed}</p>}

        <div className="flex-1 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={28} className="mx-auto mb-3 text-text-muted" />
              <p className="text-sm text-text-muted">{copy.noProjects}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <article key={project.id} className="p-5 hover:bg-surface-alt/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => { onOpenProject(project); event("project_opened", { content_saved: project.saveContent ? 1 : 0 }); onClose(); }} className="min-w-0 flex-1 text-left rounded-lg focus-visible:outline-none">
                      <div className="flex items-center gap-2 min-w-0">
                        {project.pinned && <Pin size={13} className="text-primary shrink-0" />}
                        <h3 className="font-medium text-sm truncate">{project.name}</h3>
                      </div>
                      <p className="mt-1 text-xs text-text-muted">{formatDate(project.updatedAt)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                        <span className="rounded-full border border-border px-2 py-0.5">{project.mode === "smart" ? "Smart" : "Exact"}</span>
                        <span className={`rounded-full border px-2 py-0.5 ${project.saveContent ? "border-success/30 text-success" : "border-border"}`}>
                          {project.saveContent ? copy.contentSaved : copy.contentNotSaved}
                        </span>
                        {project.result && <span>{project.result.stats.matchRate}%</span>}
                      </div>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={async () => { await setProjectPinned(project.id, !project.pinned); await refresh(); }} aria-label={project.pinned ? copy.unpin : copy.pin} title={project.pinned ? copy.unpin : copy.pin} className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt/60">
                        {project.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                      </button>
                      <button type="button" onClick={() => { exportProject(project); event("project_exported", { content_saved: project.saveContent ? 1 : 0 }); }} aria-label={copy.exportProject} title={copy.exportProject} className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt/60">
                        <Download size={15} />
                      </button>
                      <button type="button" onClick={async () => { if (!window.confirm(copy.confirmDeleteProject)) return; await deleteProject(project.id); await refresh(); }} aria-label={copy.delete} title={copy.delete} className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-danger hover:bg-danger/10">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
