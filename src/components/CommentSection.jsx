import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import "../styles/commentSection.css";

const CommentSection = ({ videoId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    axios
      .get(`/comments/${videoId}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [videoId]);

  const addComment = async () => {
    if (!text.trim()) return;

    try {
      setSending(true);

      const res = await axios.post("/comments", {
        videoId,
        text
      });

      setComments([res.data, ...comments]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      await axios.delete(`/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (id) => {
    try {
      const res = await axios.put(`/comments/like/${id}`);
      setComments(
        comments.map(c =>
          c._id === id ? res.data : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const pinComment = async (id) => {
    try {
      const res = await axios.put(`/comments/pin/${id}`);
      setComments(
        comments.map(c =>
          c._id === id ? res.data : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const sortedComments = [...comments].sort(
    (a, b) => (b.isPinned === true) - (a.isPinned === true)
  );

  return (
    <div className="comment-box">
      <h3>Comments</h3>

      {/* FORM WRAPPER */}
      <form
        className="comment-input-wrapper"
        onSubmit={(e) => {
          e.preventDefault();
          addComment();
        }}
      >
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Share your thoughts..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addComment();
            }
          }}
        />

        <button
          type="submit"
          disabled={!text.trim() || sending}
          className={sending ? "sending" : ""}
        >
          {sending ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="comment-list">
        {sortedComments.map(c => {
          return (
            <div
              key={c._id}
              className={`comment-card ${c.isPinned ? "pinned" : ""}`}
            >
              <div className="avatar">
                {c.user?.name?.charAt(0)}
              </div>

              <div className="comment-body">
                <div className="comment-top">
                  <div className="name-group">
                    <span className="comment-name">
                      {c.user?.name}
                    </span>

                    {String(currentUser) === String(c.user?._id) && (
                      <span className="author-badge">
                        You
                      </span>
                    )}

                    {c.isPinned && (
                      <span className="pinned-badge">
                        📌 Pinned
                      </span>
                    )}
                  </div>

                  <span className="comment-time">
                    {formatDistanceToNow(new Date(c.createdAt), {
                      addSuffix: true
                    })}
                  </span>
                </div>

                <p className="comment-text">{c.text}</p>

                <div className="comment-actions">
                  <button
                    className={`like-btn ${
                      c.likes?.includes(currentUser) ? "liked" : ""
                    }`}
                    onClick={() => toggleLike(c._id)}
                  >
                    ❤️ {c.likes?.length || 0}
                  </button>

                  {String(currentUser) === String(c.user?._id) && (
                    <>
                      <button
                        className="delete-btn"
                        onClick={() => deleteComment(c._id)}
                      >
                        🗑 Delete
                      </button>

                      <button
                        className="pin-btn"
                        onClick={() => pinComment(c._id)}
                      >
                        📌 Pin
                      </button>
                    </>
                  )}
                </div>

                <div className="divider"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
