import axiosInstance from "../api/axiosInstance";

export type User = { email: string };
type BackendUser = { id: number; fullName: string; email: string };

const STORAGE_KEY = "handsforhire_auth";
const USERS_KEY = "handsforhire_users";
const ADMIN_EMAILS = ["demo@handsforhire.com"];

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
  const e = email.trim().toLowerCase();
  try {
    const { data } = await axiosInstance.get<BackendUser>(`/Users/by-email/${encodeURIComponent(e)}`);
    const user: User = { email: data.email };

    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.removeItem(STORAGE_KEY);
    }

    return user;
  } catch {
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

export function isAdmin(user: User | null): boolean {
  return !!user && ADMIN_EMAILS.includes(user.email);
}

export function changePassword(email: string, newPassword: string) {
  const e = email.trim().toLowerCase();
  const users = loadUsers();
  if (!users[e]) throw new Error("User not found.");
  users[e] = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function deleteAccount(email: string) {
  const e = email.trim().toLowerCase();
  const users = loadUsers();

  if (e === "demo@handsforhire.com") {
    throw new Error("Demo account cannot be deleted.");
  }

  delete users[e];
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  logout();
}
const AVATAR_KEY = "handsforhire_avatar";

export function getAvatarDataUrl(): string | null {
  return localStorage.getItem(AVATAR_KEY);
}

export function setAvatarDataUrl(dataUrl: string) {
  localStorage.setItem(AVATAR_KEY, dataUrl);
}

export function clearAvatar() {
  localStorage.removeItem(AVATAR_KEY);
}
