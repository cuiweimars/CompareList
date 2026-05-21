"use client";

import { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { getCredits } from "@/lib/credits";
import { usePaddle } from "@/lib/paddle/context";
import { CREDIT_PACKAGES, openCheckout } from "@/lib/paddle/checkout";

export default function CreditsDisplay() {
  const [balance, setBalance] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const paddle = usePaddle();

  useEffect(() => {
    setBalance(getCredits().balance);
  }, []);

  function handleBuy(pkg: (typeof CREDIT_PACKAGES)[number]) {
    if (!paddle) return;
    openCheckout(paddle, pkg, (newBalance) => {
      setBalance(newBalance);
      setShowPanel(false);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-alt/50 transition-colors text-sm"
      >
        <Coins size={14} className="text-amber-500" />
        <span className={balance > 0 ? "text-text" : "text-danger"}>
          {balance} credit{balance !== 1 ? "s" : ""}
        </span>
      </button>

      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#0f1629] rounded-xl shadow-2xl p-4 z-50">
          <h3 className="font-semibold text-sm mb-3 font-[family-name:var(--font-sora)]">AI Credits</h3>
          <p className="text-xs text-text-secondary mb-3">
            Each AI comparison uses 1 credit. Includes fuzzy matching, DeepSeek AI analysis, and smart insights.
          </p>
          <div className="space-y-2">
            {CREDIT_PACKAGES.map((pkg, i) => (
              <button
                key={i}
                onClick={() => handleBuy(pkg)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  i === 1
                    ? "border border-primary/30 bg-primary/5 hover:bg-primary/10"
                    : "border border-border hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{pkg.label}</span>
                  {pkg.save && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        i === 2
                          ? "bg-green-100 text-green-700"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {pkg.save}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold">{pkg.price}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted">Current balance</span>
            <span className="text-sm font-semibold">{balance} credits</span>
          </div>
          {!paddle && (
            <p className="text-xs text-text-muted mt-2 text-center">
              Payment system loading...
            </p>
          )}
          <button
            onClick={() => setShowPanel(false)}
            className="mt-2 w-full text-xs text-text-muted hover:text-text transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
