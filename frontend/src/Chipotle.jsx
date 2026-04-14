import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { CiMapPin } from "react-icons/ci";


function Chipotle() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [chipotle, setChipotle] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const getCsrfToken = async () => {
      const res = await fetch("http://localhost:3000/csrf-token", {
        credentials: "include",
      });

      const data = await res.json();
      setCsrfToken(data.csrfToken);
    };

    getCsrfToken();
  }, []);

  const fetchChipotle = async () => {
    try {
      const res = await fetch(`http://localhost:3000/chipotles/${id}`, {
        credentials: "include",
      });

      const data = await res.json();
      setChipotle(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChipotle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment) return;

    setSubmitting(true);

    try {
      await fetch(`http://localhost:3000/chipotles/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          rating: Number(rating),
          comment,
        }),
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chipotle) {
    return <div>Chipotle not found</div>;
  }

  return (
    <div>
      <h2>{chipotle.location}</h2>
      <h4> <CiMapPin /> {chipotle.address} </h4> 

      <p>
        Overall Rating:{" "}
        <strong>
          {chipotle.overallRating !== undefined && chipotle.overallRating !== null
            ? Number(chipotle.overallRating).toFixed(1)
            : "N/A"}
        </strong>
      </p>

      <p>
        <FaThumbsUp /> {chipotle.likes || 0}{" "}
        <FaThumbsDown /> {chipotle.dislikes || 0}
      </p>

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
            <p className="review-user">
              {r.username}
            </p>
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