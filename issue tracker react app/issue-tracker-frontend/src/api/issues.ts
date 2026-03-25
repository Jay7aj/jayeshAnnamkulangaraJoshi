import { apiFetch } from "./client";
import type { Issue, IssuePriority } from "../types/issue";
import type { PaginatedResponse } from "../types/api";
import type { IssueQuery } from "../types/issue";

export function getIssues(params: IssueQuery = {}) {
  const query = buildQuery(params);
  return apiFetch<PaginatedResponse<Issue>>(`/issues${query}`);
}

export function getIssueById(id: string) {
    return apiFetch<{ data: Issue }>(`/issues/${id}`);
}

function buildQuery(params: Record<string, any>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export function createIssue(data: {
  title: string;
  description?: string;
  priority?: IssuePriority;
  assignedTo?: string;
}) {
  return apiFetch<{ data: Issue }>("/issues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateIssue(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    assignedTo: string | null;
  }>
) {
  return apiFetch<{ data: Issue }>(`/issues/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}