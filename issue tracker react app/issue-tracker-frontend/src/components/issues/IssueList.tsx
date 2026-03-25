// src/components/issues/IssueList.tsx

import type { Issue } from "../../types/issue";
import IssueCard from "./IssueCard";

interface IssueListProps {
  issues: Issue[];
}

export default function IssueList({ issues }: IssueListProps) {
  if (issues.length === 0) {
    return <p>No issues found.</p>;
  }

  return (
    <div>
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}