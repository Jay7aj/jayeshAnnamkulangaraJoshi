// issue-tracker-frontend/src/types/issue.ts

export type IssueStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'DONE'

export type IssuePriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

export interface Issue {
  id: string
  title: string
  description: string | null
  status: IssueStatus
  priority: IssuePriority
  created_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
  assigned_to_name?: string | null;
}

export interface IssueQuery {
  status?: IssueStatus;
  priority?: IssuePriority;
  assignedTo?: string;
  createdBy?: string;
  search?: string;

  page?: number;
  limit?: number;

  sort?: 'created_at' | 'updated_at' | 'priority' | 'status';
  order?: 'asc' | 'desc';
}

export const ISSUE_STATUS_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["DONE", "OPEN"],
  DONE: ["IN_PROGRESS"]
};