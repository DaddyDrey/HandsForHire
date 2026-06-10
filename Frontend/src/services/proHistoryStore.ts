import type { ProProfile } from "../types/pro";

const STORAGE_KEY = "handsforhire_pro_history";
const MAX_HISTORY_ITEMS = 10;

export type ProHistoryItem = {
  id: string;
  proId: string;
  proName: string;
  trade: string;
  city: string;
  viewedAt: string;
};

type HistoryByEmail = Record<string, ProHistoryItem[]>;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readHistory(): HistoryByEmail {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as HistoryByEmail : {};
  } catch {
    return {};
  }
}

function writeHistory(history: HistoryByEmail) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getProHistory(email: string): ProHistoryItem[] {
  return readHistory()[normalizeEmail(email)] ?? [];
}

export function recordProView(email: string, pro: ProProfile) {
  const normalized = normalizeEmail(email);
  const history = readHistory();
  const viewedAt = new Date().toISOString().slice(0, 10);
  const nextItem: ProHistoryItem = {
    id: `${pro.id}-${Date.now()}`,
    proId: pro.id,
    proName: pro.name,
    trade: pro.trade,
    city: pro.city,
    viewedAt,
  };

  const current = history[normalized] ?? [];
  history[normalized] = [
    nextItem,
    ...current.filter((item) => item.proId !== pro.id),
  ].slice(0, MAX_HISTORY_ITEMS);

  writeHistory(history);
}
