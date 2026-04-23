import type { Review } from './pros';

const STORAGE_KEY = 'handsforhire_user_reviews';

export type UserReviewEntry = {
  rating: number;
  text: string;
  date: string;
  author: string;
};

type UserReviewsMap = Record<string, Record<string, UserReviewEntry>>;

let tick = 0;

function bumpTick() {
  tick++;
}

if (typeof window !== 'undefined') {
  window.addEventListener('hfh:reviews-updated', bumpTick);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) bumpTick();
  });
}

export function getReviewsTick(): number {
  return tick;
}

function loadMap(): UserReviewsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as UserReviewsMap;
    return {};
  } catch {
    return {};
  }
}

function saveMap(map: UserReviewsMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent('hfh:reviews-updated'));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function userReviewId(email: string) {
  return `user-${normalizeEmail(email)}`;
}

export function getMyReview(proId: string, email: string): UserReviewEntry | null {
  const map = loadMap();
  const entry = map[proId]?.[normalizeEmail(email)];
  return entry ?? null;
}

export function upsertMyReview(
  proId: string,
  email: string,
  data: { rating: number; text: string; author: string }
) {
  const e = normalizeEmail(email);
  const map = loadMap();
  const forPro = map[proId] ?? {};
  forPro[e] = {
    rating: Math.max(1, Math.min(5, data.rating)),
    text: data.text.trim(),
    author: data.author.trim() || e,
    date: new Date().toISOString().slice(0, 10),
  };
  map[proId] = forPro;
  saveMap(map);
}

export function deleteMyReview(proId: string, email: string) {
  const e = normalizeEmail(email);
  const map = loadMap();
  if (map[proId]?.[e]) {
    delete map[proId][e];
    if (Object.keys(map[proId]).length === 0) delete map[proId];
    saveMap(map);
  }
}

export type DisplayReview = Review & {
  ownedByEmail?: string;
};

export function getUserReviewsForPro(proId: string): DisplayReview[] {
  const map = loadMap();
  const userEntries = map[proId] ?? {};
  return Object.entries(userEntries).map(([email, r]) => ({
    id: userReviewId(email),
    author: r.author,
    rating: r.rating,
    date: r.date,
    text: r.text,
    ownedByEmail: email,
  }));
}

export function getAllReviewsForPro(proId: string, baseReviews: Review[] = []): DisplayReview[] {
  return [...baseReviews, ...getUserReviewsForPro(proId)];
}

export function getProAggregate(
  proId: string,
  baseReviews: Review[] = []
): { rating: number; count: number } {
  const all = getAllReviewsForPro(proId, baseReviews);
  if (all.length === 0) return { rating: 0, count: 0 };
  const sum = all.reduce((acc, r) => acc + r.rating, 0);
  return {
    rating: Math.round((sum / all.length) * 10) / 10,
    count: all.length,
  };
}

export function subscribeToReviews(listener: () => void): () => void {
  const handler = () => listener();
  window.addEventListener('hfh:reviews-updated', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('hfh:reviews-updated', handler);
    window.removeEventListener('storage', handler);
  };
}
