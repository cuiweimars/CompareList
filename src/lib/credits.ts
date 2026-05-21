export interface CreditsState {
  balance: number;
  history: CreditTransaction[];
}

export interface CreditTransaction {
  id: string;
  type: "purchase" | "usage" | "bonus";
  amount: number;
  description: string;
  timestamp: number;
}

const STORAGE_KEY = "comparelist_credits";
const BONUS_CREDITS = 3;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getCredits(): CreditsState {
  if (typeof window === "undefined") {
    return { balance: 0, history: [] };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: CreditsState = {
      balance: BONUS_CREDITS,
      history: [
        {
          id: generateId(),
          type: "bonus",
          amount: BONUS_CREDITS,
          description: "Welcome bonus - 3 free AI comparisons",
          timestamp: Date.now(),
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
}

export function useCredit(): { success: boolean; remaining: number } {
  const credits = getCredits();
  if (credits.balance <= 0) {
    return { success: false, remaining: 0 };
  }
  credits.balance -= 1;
  credits.history.push({
    id: generateId(),
    type: "usage",
    amount: -1,
    description: "AI List Comparison",
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
  return { success: true, remaining: credits.balance };
}

export function addCredits(amount: number, description: string): CreditsState {
  const credits = getCredits();
  credits.balance += amount;
  credits.history.push({
    id: generateId(),
    type: "purchase",
    amount,
    description,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
  return credits;
}

export function resetCredits(): void {
  localStorage.removeItem(STORAGE_KEY);
}
