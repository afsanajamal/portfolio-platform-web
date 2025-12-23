import { getAccessToken } from "./auth";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type FetchOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
};

export type LoginRequest = { username: string; password: string }; // OAuth2PasswordRequestForm

export async function login(data: LoginRequest): Promise<TokenPair> {
  const form = new URLSearchParams();
  form.set("username", data.username);
  form.set("password", data.password);

  return apiFetch<TokenPair>("/auth/login", {
    method: "POST",
    body: form,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
}

export type Project = {
  id: number;
  title: string;
  description: string;
  github_url: string;
  is_public: boolean;
  owner_id: number;
  tags: { id: number; name: string }[];
};

export async function listProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/projects", { method: "GET", auth: true });
}
