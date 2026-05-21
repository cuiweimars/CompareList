import type { Paddle } from "@paddle/paddle-js";
import { addCredits } from "@/lib/credits";

export const PRICES = {
  single: process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE || "pri_single",
  pack10: process.env.NEXT_PUBLIC_PADDLE_PRICE_PACK10 || "pri_pack10",
  pack30: process.env.NEXT_PUBLIC_PADDLE_PRICE_PACK30 || "pri_pack30",
} as const;

interface CreditPackage {
  priceId: string;
  credits: number;
  label: string;
  price: string;
  save?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    priceId: PRICES.single,
    credits: 1,
    label: "1 Credit",
    price: "$0.99",
  },
  {
    priceId: PRICES.pack10,
    credits: 10,
    label: "10 Credits",
    price: "$4.99",
    save: "Save 33%",
  },
  {
    priceId: PRICES.pack30,
    credits: 30,
    label: "30 Credits",
    price: "$9.99",
    save: "Save 50%",
  },
];

export function openCheckout(
  paddle: Paddle,
  pkg: CreditPackage,
  onSuccess?: (credits: number) => void
) {
  paddle.Checkout.open({
    items: [{ priceId: pkg.priceId, quantity: 1 }],
    settings: {
      displayMode: "overlay",
      theme: "light",
      locale: "en",
      successUrl: `${window.location.origin}?paddle_success=1&credits=${pkg.credits}`,
    },
    customData: {
      credits: pkg.credits,
      label: pkg.label,
    },
  });

  // Listen for messages from Paddle checkout
  const handler = (event: MessageEvent) => {
    if (event.data?.type === "paddle:checkout:completed") {
      const result = addCredits(pkg.credits, `${pkg.label} purchase`);
      onSuccess?.(result.balance);
      window.removeEventListener("message", handler);
    }
  };
  window.addEventListener("message", handler);
}
