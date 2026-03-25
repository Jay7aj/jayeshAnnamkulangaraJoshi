// src/components/issues/CreateIssueForm.tsx

import { useState } from "react";
import { createIssue } from "../../api/issues";
import type { IssuePriority } from "../../types/issue";
import { useEffect } from "react";
import { getUsers, type UserOption } from "../../api/users";

interface CreateIssueFormProps {
  onCreated: () => void;
}

export default function CreateIssueForm({ onCreated }: CreateIssueFormProps) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>("");

    useEffect(() => {
        async function loadUsers() {
            try {
            const res = await getUsers();
            setUsers(res.data);
            } catch (err) {
            console.error(err);
            }
        }

        loadUsers();
    }, []);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setLoading(true);

      await createIssue({
        title,
        description,
        priority,
        assignedTo: assignedTo || undefined // ✅ FIXED
      });

      // reset form
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setAssignedTo("");

      onCreated();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Create Issue</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd"
            }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd"
            }}
        />
      </div>

      <div>
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

      <div>
        <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
        >
            <option value="">Unassigned</option>

            {users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                </option>
            ))}
        </select>
    </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}