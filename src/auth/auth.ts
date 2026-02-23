export type User = { email: string };

const STORAGE_KEY = "handsforhire_auth";
const USERS_KEY = "handsforhire_users";

const MOCK_USERS: Record<string, string> = {
  "demo@handsforhire.com": "demo1234",
  "test@test.com": "test1234",
};
function loadUsers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return { ...MOCK_USERS };
    const parsed = JSON.parse(raw) as Record<string, string>;
    return { ...MOCK_USERS, ...parsed };
  } catch {
    return { ...MOCK_USERS };
  }
}

export function saveMockUser(email: string, password: string) {
  const e = email.trim().toLowerCase();
  const users = loadUsers();
  users[e] = password;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function login(email: string, password: string, remember: boolean) {
  await new Promise((r) => setTimeout(r, 200));

  const e = email.trim().toLowerCase();
const expected = loadUsers()[e];

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