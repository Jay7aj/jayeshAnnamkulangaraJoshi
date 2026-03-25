import type { Issue, IssueStatus, IssuePriority } from "../../types/issue";
import { useNavigate } from "react-router-dom";

interface IssueCardProps {
  issue: Issue;
}

const statusColors: Record<IssueStatus, string> = {
  OPEN: "green",
  IN_PROGRESS: "orange",
  DONE: "gray"
};

const priorityColors: Record<IssuePriority, string> = {
  LOW: "blue",
  MEDIUM: "goldenrod",
  HIGH: "orange",
  CRITICAL: "red"
};

export default function IssueCard({ issue }: IssueCardProps) {
  const navigate = useNavigate();

  return (
    <div
        onClick={() => navigate(`/issues/${issue.id}`)}
        style={{
            border: "1px solid #e5e7eb",
            padding: "16px",
            marginBottom: "12px",
            borderRadius: "8px",
            background: "white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            cursor: "pointer",
            transition: "0.2s"
        }}
    >
      <h3 style={{margin: "0 0 8px 0"}}>{issue.title}</h3>

      {issue.description && (<p style={{ color: "#6b7280", marginBottom: "10px" }}>{issue.description}</p>)}

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span
          style={{
            backgroundColor: statusColors[issue.status],
            color: "white",
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "12px"
          }}
        >
          {issue.status}
        </span>

        <span
          style={{
            backgroundColor: priorityColors[issue.priority],
            color: "white",
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "12px"
          }}
        >
          {issue.priority}
        </span>

        {issue.assigned_to_name && (
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>Assigned to: {issue.assigned_to_name}</p>
        )}

      </div>
    </div>
  );
}