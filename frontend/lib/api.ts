export type PortfolioProject = {
  id: string;
  title: string;
  description?: string;
  urls: string[];
  technologies: string[];
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
};

export type PublicProfile = {
  id: string;
  name: string;
  headline?: string;
  bio?: string;
  skills: string[];
  portfolioProjects: PortfolioProject[];
};

export type Profile = PublicProfile & {
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export class ApiError extends Error {
  statusCode: number;
  errors: unknown[];

  constructor(message: string, statusCode: number, errors: unknown[] = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

type Envelope<T> =
  | { success: true; data: T; message?: string }
  | { success: false; statusCode: number; message: string; errors: unknown[] };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy/${path}`, {
    ...options,
    headers: { "content-type": "application/json", ...options?.headers },
  });

  const payload = (await res.json()) as Envelope<T>;

  if (!payload.success) {
    throw new ApiError(payload.message, payload.statusCode, payload.errors);
  }

  return payload.data;
}

export const apiFetch = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
