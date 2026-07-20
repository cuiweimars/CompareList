"use client";

import { useEffect, useState } from "react";
import { Download, WifiOff, X } from "lucide-react";
import { useLocale } from "next-intl";
import { getWorkspaceCopy } from "@/lib/workspace-copy";
import { event as trackEvent } from "@/lib/gtag";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaRegister() {
  const copy = getWorkspaceCopy(useLocale());
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const updateNetwork = () => setOffline(!navigator.onLine);
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    updateNetwork();
    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    window.addEventListener("beforeinstallprompt", capturePrompt);
    return () => {
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
      window.removeEventListener("beforeinstallprompt", capturePrompt);
    };
  }, []);

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    trackEvent("pwa_install_prompt_completed", { outcome: choice.outcome });
    setInstallPrompt(null);
  }

  if (dismissed || (!offline && !installPrompt)) return null;
  return (
    <div className="fixed bottom-3 left-3 z-[80] flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-xl border border-border bg-[#0f1629]/95 p-2 pl-3 text-xs shadow-2xl backdrop-blur-xl" role="status">
      {offline ? <WifiOff size={15} className="text-amber-500" /> : <Download size={15} className="text-primary" />}
      <span className="text-text-secondary">{offline ? copy.offlineMode : copy.installAppDescription}</span>
      {!offline && installPrompt && <button type="button" onClick={install} className="min-h-9 rounded-lg bg-primary px-3 font-medium text-white">{copy.installApp}</button>}
      <button type="button" onClick={() => setDismissed(true)} className="w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-surface-alt/50" aria-label={copy.close}><X size={14} /></button>
    </div>
  );
}
