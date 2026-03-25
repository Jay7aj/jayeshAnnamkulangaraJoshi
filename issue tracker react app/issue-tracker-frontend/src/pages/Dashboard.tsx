// issue-tracker-frontend/src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getIssues } from "../api/issues";
import RoleGuard from "../components/RoleGuard";
import IssueList from "../components/issues/IssueList";
import IssueFilters from "../components/issues/IssueFilters";
import type { IssueQuery } from "../types/issue";
import type { PaginationMeta } from "../types/api";
import Pagination from "../components/common/Pagination";
import CreateIssueForm from "../components/issues/CreateIssueForm";

import type { Issue } from "../types/issue";
import type { AsyncState } from "../types/async";

export default function Dashboard() {

  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [filters, setFilters] = useState<IssueQuery>({});

  const { user, logout } = useAuth();

  const [issuesState, setIssuesState] = useState<AsyncState<Issue[]>>({
    status: "idle",
  });

  useEffect(() => {

  async function loadIssues() {
    setIssuesState({ status: "loading" });

    try {

      const res = await getIssues(filters);

      setIssuesState({
        status: "success",
        data: res.data
      });

      setPagination(res.meta);

    } catch (err: any) {

      setIssuesState({
        status: "error",
        error: err.message
      });

    }
  }

  loadIssues();

}, [filters]);

  return (
    <div>
      {/* Header section */}
      <h1>Dashboard</h1>
      <p>Welcome {user?.name}</p>

      {/* Admin only UI */}
      <RoleGuard allowed={["ADMIN"]}>
        <button>Admin Only Action</button>
      </RoleGuard>

      <button onClick={logout}>Logout</button>

      <hr />

      <IssueFilters
        filters={filters}
        onChange={setFilters}
      />

      {/* Issues section */}
      <h2>Issues</h2>

      {issuesState.status === "loading" && <div>Loading issues...</div>}

      {issuesState.status === "error" && (
        <div>Error: {issuesState.error}</div>
      )}

      {issuesState.status === "success" && (
        <IssueList issues={issuesState.data} />
      )}

      <CreateIssueForm
        onCreated={() => {
          // refetch issues
          setFilters(prev => ({ ...prev }));
        }}
      />

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={(page) =>
            setFilters(prev => ({
              ...prev,
              page
            }))
          }
        />
      )}

    </div>
  );
}