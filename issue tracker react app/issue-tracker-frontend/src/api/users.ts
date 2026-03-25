import { apiFetch } from "./client";

export interface UserOption {
  id: string;
  name: string;
  email: string;
}

export function getUsers() {
  return apiFetch<{ data: UserOption[] }>("/users");
}