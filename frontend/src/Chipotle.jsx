import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { CiMapPin } from "react-icons/ci";
import { apiUrl } from "./api.js";

function Chipotle() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [chipotle, setChipotle] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  useEffect(() => {
    const getCsrfToken = async () => {
      const res = await fetch(apiUrl("/csrf-token"), {
        credentials: "include",
      });
      const data = await res.json();
      setCsrfToken(data.csrfToken);
    };
    getCsrfToken();
  }, []);

  const fetchChipotle = async () => {
    try {
      const res = await fetch(apiUrl(`/chipotles/${id}`), {
        credentials: "include",
      });
      const data = await res.json();
      setChipotle(data);
      setUserLiked(data.userLiked || false);
      setUserDisliked(data.userDisliked || false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChipotle();
  }, [id]);

  const authPost = (url) =>
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "x-csrf-token": csrfToken },
    });

  const handleLike = async () => {
    const url = userLiked
      ? apiUrl(`/users/unlike/${id}`)
      : apiUrl(`/users/like/${id}`);
    try {
      const res = await authPost(url);
      if (!res.ok) throw new Error("Failed");
      setChipotle((prev) => ({
        ...prev,
        likes: userLiked ? prev.likes - 1 : prev.likes + 1,
        dislikes: userDisliked ? prev.dislikes - 1 : prev.dislikes,
      }));
      if (userDisliked) setUserDisliked(false);
      setUserLiked((prev) => !prev);
    } catch (e) {
      console.error("Like error:", e);
    }
  };

  const handleDislike = async () => {
    const url = userDisliked
      ? apiUrl(`/users/undislike/${id}`)
      : apiUrl(`/users/dislike/${id}`);
    try {
      const res = await authPost(url);
      if (!res.ok) throw new Error("Failed");
      setChipotle((prev) => ({
        ...prev,
        dislikes: userDisliked ? prev.dislikes - 1 : prev.dislikes + 1,
        likes: userLiked ? prev.likes - 1 : prev.likes,
      }));
      if (userLiked) setUserLiked(false);
      setUserDisliked((prev) => !prev);
    } catch (e) {
      console.error("Dislike error:", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return;
    setSubmitting(true);
    try {
      await fetch(apiUrl(`/chipotles/${id}/review`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ rating: Number(rating), comment }),
      });
      await fetchChipotle();
      setRating("");
      setComment("");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!chipotle) return <div>Chipotle not found</div>;

  return (
    <div>
      <h2>{chipotle.location}</h2>
      <h4><CiMapPin /> {chipotle.address}</h4>

      <p>
        Overall Rating:{" "}
        <strong>
          {chipotle.overallRating !== undefined && chipotle.overallRating !== null
            ? Number(chipotle.overallRating).toFixed(1)
            : "N/A"}
        </strong>
      </p>

      <div className="vote-buttons">
        <button
          onClick={handleLike}
          className={`vote-btn ${userLiked ? "liked" : ""}`}
        >
          <FaThumbsUp /> {chipotle.likes || 0}
        </button>
        <button
          onClick={handleDislike}
          className={`vote-btn ${userDisliked ? "disliked" : ""}`}
        >
          <FaThumbsDown /> {chipotle.dislikes || 0}
        </button>
      </div>

      <hr />

      <h3>Add a Review</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting" : "Submit Review"}
        </button>
      </form>

      <hr />

      <h3>Reviews</h3>
      <div className="reviews">
        {chipotle.ratings && chipotle.ratings.length > 0 ? (
          chipotle.ratings.map((r, index) => (
            <div key={index} className="review-card">
              <p className="review-user">{r.username}</p>
              <div className="review-rating">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>
    </div>
  );
}

export default Chipotle;