import { API_BASE_URL, STORAGE_KEYS } from "@/constants/api";

import type {
  ApiEnvelope,
  ApiErrorPayload,
} from "@/types/api";

export class ApiClientError extends Error {
  status: number;
  details?: ApiErrorPayload["errors"];

  constructor(message: string, status: number, details?: ApiErrorPayload["errors"]) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = RequestInit & {
  token?: string | null;
};

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.token);
}

export function setStoredSession(token: string, user: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.token, token);
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.token);
  window.localStorage.removeItem(STORAGE_KEYS.user);
}

export function getStoredUser<T>() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(STORAGE_KEYS.user);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as T;
  } catch {
    return null;
  }
}

async function parseResponse<T>(response: Response): Promise<ApiEnvelope<T> | T | null> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as ApiEnvelope<T> | T;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const activeToken = token ?? getStoredToken();

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      ...headers,
    },
  });

  const payload = await parseResponse<T>(response);

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;

    throw new ApiClientError(
      errorPayload?.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorPayload?.errors
    );
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}