export type UserRole = "admin" | "editor" | "viewer";

const ACCESS_TOKEN_KEY = "pp_access_token";
const ROLE_KEY = "pp_role";

export function setAuth(accessToken: string, role: UserRole) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getAccessToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRole(): UserRole | null {
  const v = typeof window === "undefined" ? null : localStorage.getItem(ROLE_KEY);
  return (v as UserRole) ?? null;
}

export function isAuthed(): boolean {
  return !!getAccessToken();
}
