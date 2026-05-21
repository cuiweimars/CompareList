"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

const PaddleContext = createContext<Paddle | undefined>(undefined);

export function usePaddle() {
  return useContext(PaddleContext);
}

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") || "sandbox",
      token,
    }).then((instance) => {
      if (instance) setPaddle(instance);
    });
  }, []);

  return (
    <PaddleContext.Provider value={paddle}>
      {children}
    </PaddleContext.Provider>
  );
}
