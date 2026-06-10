import axiosInstance from "../api/axiosInstance";
import { THEME_RESET_EVENT, THEME_STORAGE_KEY } from "../theme/themeModes";

export type User = {
  id: number;
  fullName: string;
  email: string;
  city?: string;
  birthYear?: number | null;
  phoneNumber?: string;
  status?: "Active" | "Suspended";
  warningCount?: number;
};

type BackendUser = {
  id: number;
  fullName: string;
  email: string;
  city?: string;
  birthYear?: number | null;
  phoneNumber?: string;
  status?: "Active" | "Suspended";
  warningCount?: number;
};

const STORAGE_KEY = "handsforhire_auth";
const ADMIN_EMAILS = ["demo@handsforhire.com"];
const AVATAR_KEY = "handsforhire_avatar";

function persistUser(user: User, remember: boolean) {
  if (remember) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function login(email: string, password: string, remember: boolean) {
  try {
    const { data } = await axiosInstance.post<BackendUser>("/Users/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    const user: User = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      city: data.city ?? "",
      birthYear: data.birthYear ?? null,
      phoneNumber: data.phoneNumber ?? "",
      status: data.status ?? "Active",
      warningCount: data.warningCount ?? 0,
    };
    persistUser(user, remember);
    return user;
  } catch (error: unknown) {
    const message = getApiErrorMessage(error) || "Email sau parola incorectă.";
    throw new Error(message);
  }
}

export async function register(fullName: string, email: string, password: string, remember: boolean) {
  try {
    const { data } = await axiosInstance.post<BackendUser>("/Users/register", {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    const user: User = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      city: data.city ?? "",
      birthYear: data.birthYear ?? null,
      phoneNumber: data.phoneNumber ?? "",
      status: data.status ?? "Active",
      warningCount: data.warningCount ?? 0,
    };
    persistUser(user, remember);
    return user;
  } catch (error: unknown) {
    const message = getApiErrorMessage(error) || "Could not create account.";
    throw new Error(message);
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(THEME_STORAGE_KEY);
  window.dispatchEvent(new Event(THEME_RESET_EVENT));
}

export function getUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<User>;
    if (!parsed.email) return null;
    return {
      id: parsed.id ?? 0,
      fullName: parsed.fullName ?? parsed.email,
      email: parsed.email,
      city: parsed.city ?? "",
      birthYear: parsed.birthYear ?? null,
      phoneNumber: parsed.phoneNumber ?? "",
      status: parsed.status ?? "Active",
      warningCount: parsed.warningCount ?? 0,
    };
  } catch {
    return null;
  }
}

export function updateStoredUser(user: User) {
  if (localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return;
  }

  if (sessionStorage.getItem(STORAGE_KEY)) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

export function isAdmin(user: User | null): boolean {
  return !!user && ADMIN_EMAILS.includes(user.email);
}

export function isSuspended(user: User | null): boolean {
  return user?.status === "Suspended";
}

export async function changePassword(email: string, currentPassword: string, newPassword: string) {
  try {
    await axiosInstance.post("/Users/change-password", {
      email: email.trim().toLowerCase(),
      currentPassword,
      newPassword,
    });
  } catch (error: unknown) {
    const message = getApiErrorMessage(error) || "Could not change password.";
    throw new Error(message);
  }
}

export function deleteAccount(email: string) {
  if (email.trim().toLowerCase() === "demo@handsforhire.com") {
    throw new Error("Demo account cannot be deleted.");
  }

  logout();
}

export function getAvatarDataUrl(): string | null {
  return localStorage.getItem(AVATAR_KEY);
}

export function setAvatarDataUrl(dataUrl: string) {
  localStorage.setItem(AVATAR_KEY, dataUrl);
}

export function clearAvatar() {
  localStorage.removeItem(AVATAR_KEY);
}

function getApiErrorMessage(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: unknown } }).response?.data === "string"
  ) {
    return (error as { response: { data: string } }).response.data;
  }

  return null;
}
