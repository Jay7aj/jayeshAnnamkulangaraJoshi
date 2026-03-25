// src/components/comments/Comments.tsx

import { useEffect, useState } from "react";
import { getComments, createComment, type Comment } from "../../api/comments";
import { useAuth } from "../../context/AuthContext";
import { deleteComment } from "../../api/comments";

interface CommentsProps {
  issueId: string;
}

export default function Comments({ issueId }: CommentsProps) {

    const {user} = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadComments() {
    try {
      const res = await getComments(issueId);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  }

    async function handleDelete(commentId: string) {
        if (!confirm("Delete this comment?")) return;

        try {
            await deleteComment(commentId);

            // remove from UI
            setComments(prev => prev.filter(c => c.id !== commentId));

        } catch (err: any) {
            alert(err.message);
        }
    }

  useEffect(() => {
    loadComments();
  }, [issueId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setLoading(true);

      await createComment(issueId, content);

      setContent("");
      loadComments(); // refresh

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Comments</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd"
            }}
        />

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Add Comment"}
        </button>
      </form>

      <hr />

      <div>
        {comments.map((c) => (
            <div 
                key={c.id} 
                style={{
                    border: "1px solid #eee",
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    background: "#fafafa"
                }}
            >
                
                <strong>{c.user_name}</strong>
                <p>{c.content}</p>

                {(user?.role === "ADMIN" || user?.id === c.user_id) && (
                    <button 
                        onClick={() => handleDelete(c.id)}
                        style={{
                            fontSize: "12px",
                            color: "red",
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Delete
                    </button>
                )}

            </div>
        ))}
      </div>
    </div>
  );
}