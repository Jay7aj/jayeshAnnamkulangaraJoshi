import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIssueById } from "../api/issues";
import type { Issue } from "../types/issue";
import type { AsyncState } from "../types/async";
import { updateIssue } from "../api/issues";
import type { IssuePriority, IssueStatus } from "../types/issue";
import Comments from "../components/comments/Comments";
import { ISSUE_STATUS_TRANSITIONS } from "../types/issue";

export default function IssueDetail() {

  const { id } = useParams();

  
  const [state, setState] = useState<AsyncState<Issue>>({
    status: "loading"
  });
    const [status, setStatus] = useState<IssueStatus>("OPEN");
    const [priority, setPriority] = useState<IssuePriority>("MEDIUM");
    const [saving, setSaving] = useState(false);

  useEffect(() => {

    async function loadIssue() {
      try {
        const res = await getIssueById(id!);

        setState({
          status: "success",
          data: res.data
        });

        setStatus(res.data.status);
        setPriority(res.data.priority);

      } catch (err: any) {
        setState({
          status: "error",
          error: err.message
        });
      }
    }

    loadIssue();


  }, [id]);

  async function handleSave() {
    if(state.status !== 'success')return;

    if (status === issue.status && priority === issue.priority) {
        alert("No changes made");
        return;
    }
        try {
            setSaving(true);

            await updateIssue(issue.id, {
                status,
                priority
            });

            alert("Issue updated");

        } catch (err: any) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

  if (state.status === "loading") {
    return <p>Loading issue...</p>;
  }

  if (state.status === "error") {
    return <p>Error: {state.error}</p>;
  }

  if (state.status !== "success") {
    return null;
    }
  const issue = state.data;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{issue.title}</h1>

      {issue.description && <p>{issue.description}</p>}

      <p>Status: {issue.status}</p>
      <p>Priority: {issue.priority}</p>

      {issue.assigned_to_name && (
        <p>Assigned to: {issue.assigned_to_name}</p>
      )}

        <div style={{ marginTop: "20px" }}>

            <div>
                <label>Status:</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as IssueStatus)}
                >
                    {/* Current status always included */}
                    <option value={issue.status}>{issue.status}</option>

                    {/* Only allowed transitions */}
                    {ISSUE_STATUS_TRANSITIONS[issue.status].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Priority:</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as IssuePriority)}
                    >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                </select>
            </div>

                <button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>

        </div>

        <Comments issueId={issue.id} />


    </div>

  );
}