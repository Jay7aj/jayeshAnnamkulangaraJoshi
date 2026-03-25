// issue-tracker-frontend/src/api/auth.ts

import type { User } from "../types/user";
import { apiFetch } from "./client";

export interface AuthResponse {
  user: User;
  token: string;
}

export function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  }) as Promise<AuthResponse>;
}

export function login(data: {
  email: string;
  password: string;
}) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
