// src/components/issues/IssueFilters.tsx

import type { IssueStatus, IssuePriority, IssueQuery } from "../../types/issue";

interface IssueFiltersProps {
  filters: IssueQuery;
  onChange: (filters: IssueQuery) => void;
}

export default function IssueFilters({ filters, onChange }: IssueFiltersProps) {

  function updateFilter<K extends keyof IssueQuery>(key: K, value: IssueQuery[K]) {
    onChange({
      ...filters,
      [key]: value || undefined
    });
  }

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

      <select
        value={filters.status ?? ""}
        onChange={(e) =>
          updateFilter("status", e.target.value as IssueStatus)
        }
      >
        <option value="">All Status</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      <select
        value={filters.priority ?? ""}
        onChange={(e) =>
          updateFilter("priority", e.target.value as IssuePriority)
        }
      >
        <option value="">All Priority</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="CRITICAL">CRITICAL</option>
      </select>

      <input
        placeholder="Search issues..."
        value={filters.search ?? ""}
        onChange={(e) =>
          updateFilter("search", e.target.value)
        }
      />

    </div>
  );
}