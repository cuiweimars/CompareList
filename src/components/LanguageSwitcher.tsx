"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const localeLabels: Record<string, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="min-w-10 min-h-10 flex items-center justify-center gap-1.5 px-2 sm:px-3 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-surface-alt/40 transition-all"
        aria-label={`Switch language, current language ${localeLabels[locale]}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Globe size={15} />
        <span className="hidden sm:inline">{localeLabels[locale]}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-1 w-40 bg-[#0f1629] rounded-xl shadow-2xl border border-border z-50 py-1.5">
          {routing.locales.map((l) => (
            <button
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-surface-alt/50 transition-colors ${
                l === locale ? "text-primary font-medium" : "text-text-secondary"
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
