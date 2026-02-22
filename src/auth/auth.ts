export type User = { email: string };

const STORAGE_KEY = "handsforhire_auth";

const MOCK_USERS: Record<string, string> = {
  "demo@handsforhire.com": "demo1234",
  "test@test.com": "test1234",
};

export async function login(email: string, password: string, remember: boolean) {
  await new Promise((r) => setTimeout(r, 200));

  const e = email.trim().toLowerCase();
  const expected = MOCK_USERS[e];

  if (!expected || expected !== password) {
    throw new Error("Email sau parola incorectă.");
  }

  const user: User = { email: e };

  if (remember) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.removeItem(STORAGE_KEY);
  }

  return user;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}