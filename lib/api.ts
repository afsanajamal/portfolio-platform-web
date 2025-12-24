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
  // Handle empty response bodies (e.g., 204)
  const contentType = res.headers.get("content-type") || "";
  if (res.status === 204) return undefined as T;
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    return text as unknown as T;
  }

  return (await res.json()) as T;
}

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  role: "admin" | "editor" | "viewer";
  org_id: number;
  user_id: number;
};

export type LoginRequest = {
  username: string; // email goes here
  password: string;
};

export async function login(data: LoginRequest): Promise<TokenPair> {
  const form = new URLSearchParams();
  form.set("username", data.username);
  form.set("password", data.password);

  return apiFetch<TokenPair>("/auth/login", {
    method: "POST",
    body: form,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
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

// ===== Users (admin only) =====

export type UserRole = "admin" | "editor" | "viewer";

export type User = {
  id: number | string;
  email: string;
  role: UserRole;
  org_id?: number | string | null;
  created_at?: string;
};

export async function listUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users", { method: "GET", auth: true });
}

export async function createUser(data: {
  email: string;
  password: string;
  role: Exclude<UserRole, "admin">;
}): Promise<User> {
  return apiFetch<User>("/users", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

// ===== Activity =====

export type ActivityLog = {
  id: number;
  action: string;
  entity: string;
  entity_id: number;
  actor_user_id: number;
  created_at: string;
};

export async function listActivity(params?: { limit?: number; offset?: number }): Promise<ActivityLog[]> {
  const limit = params?.limit ?? 20;
  const offset = params?.offset ?? 0;
  return apiFetch<ActivityLog[]>(`/activity?limit=${limit}&offset=${offset}`, { method: "GET", auth: true });
}

// ===== Tags =====
export type Tag = { id: number; name: string };

export async function listTags(): Promise<Tag[]> {
  return apiFetch<Tag[]>("/tags", { method: "GET", auth: true });
}

export async function createTag(data: { name: string }): Promise<Tag> {
  return apiFetch<Tag>("/tags", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

// ===== ProjectCreate =====

export type ProjectCreate = {
  title: string;
  description: string;
  github_url: string;
  is_public: boolean;
  tag_names?: string[]; 
};

export type ProjectUpdate = Partial<ProjectCreate>;

export async function createProject(data: ProjectCreate): Promise<Project> {
  return apiFetch<Project>("/projects", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });

}

export async function updateProject(projectId: number, data: ProjectUpdate): Promise<Project> {
  return apiFetch<Project>(`/projects/${projectId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function deleteProject(projectId: number): Promise<void> {
  return apiFetch<void>(`/projects/${projectId}`, {
    method: "DELETE",
    auth: true,
  });
}
