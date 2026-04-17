"use client";

export type StoredUser = {
  id: string;
  phone: string;
  email: string;
  consumer?: {
    id: string;
    full_name: string;
    address: string;
    agency_id: string;
  };
};

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("token");
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem("user");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
}

export async function apiFetch<T>(input: string, init: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  const payload = (await response.json()) as {
    success?: boolean;
    message?: string;
    data?: T;
    count?: number;
  };

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}
