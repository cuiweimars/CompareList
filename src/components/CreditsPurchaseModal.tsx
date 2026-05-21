"use client";

import { useState, useEffect } from "react";
import { X, Coins, Sparkles } from "lucide-react";
import { getCredits } from "@/lib/credits";
import { usePaddle } from "@/lib/paddle/context";
import { CREDIT_PACKAGES, openCheckout } from "@/lib/paddle/checkout";

interface CreditsPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onPurchased?: (newBalance: number) => void;
}

export default function CreditsPurchaseModal({ open, onClose, onPurchased }: CreditsPurchaseModalProps) {
  const [balance, setBalance] = useState(0);
  const paddle = usePaddle();

  useEffect(() => {
    if (open) setBalance(getCredits().balance);
  }, [open]);

  if (!open) return null;

  function handleBuy(pkg: (typeof CREDIT_PACKAGES)[number]) {
    if (!paddle) return;
    openCheckout(paddle, pkg, (newBalance) => {
      setBalance(newBalance);
      onPurchased?.(newBalance);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0f1629] rounded-2xl shadow-2xl p-6 mx-4 animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-surface-alt/50 rounded-lg transition-colors">
          <X size={17} className="text-text-muted" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Coins size={22} className="text-white" />
          </div>
          <h3 className="font-semibold text-lg font-[family-name:var(--font-sora)]">Get AI Credits</h3>
          <p className="text-xs text-text-secondary mt-1">
            Unlock AI-powered fuzzy matching &amp; DeepSeek analysis
          </p>
        </div>

        <div className="space-y-2.5">
          {CREDIT_PACKAGES.map((pkg, i) => (
            <button
              key={i}
              onClick={() => handleBuy(pkg)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                i === 1
                  ? "border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 shadow-sm"
                  : "border border-border hover:bg-surface-alt/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className={i === 1 ? "text-primary" : "text-text-muted"} />
                <span className="text-sm font-medium">{pkg.label}</span>
                {pkg.save && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      i === 2 ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {pkg.save}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold">{pkg.price}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border text-center">
          <span className="text-xs text-text-muted">Current balance: </span>
          <span className="text-sm font-semibold">{balance} credits</span>
        </div>

        {!paddle && (
          <p className="text-xs text-text-muted mt-2 text-center animate-pulse">Payment system loading...</p>
        )}
      </div>
    </div>
  );
}
