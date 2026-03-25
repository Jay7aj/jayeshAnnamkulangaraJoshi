// issue-tracker-frontend/src/api/comments.ts

import { apiFetch } from "./client";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string;
}

export function getComments(issueId: string) {
  return apiFetch<{
    data: Comment[];
  }>(`/comments/issues/${issueId}/comments`);
}

export function createComment(issueId: string, content: string) {
  return apiFetch<{ data: Comment }>(
    `/comments/issues/${issueId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  );
}

export function deleteComment(commentId: string) {
  return apiFetch(`/comments/comments/${commentId}`, {
    method: "DELETE",
  });
}