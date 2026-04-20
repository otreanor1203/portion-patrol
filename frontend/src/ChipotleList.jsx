import { useEffect, useState } from "react";
import "./App.css";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiUrl } from "./api.js";

function ChipotleList() {
  const [chipotles, setChipotles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const res = await fetch("http://localhost:3000/csrf-token", {
          credentials: "include",
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (e) {
        console.error("CSRF fetch error:", e);
      }
    };

    const fetchChipotles = async () => {
      try {
        const res = await fetch(apiUrl("/chipotles"), {
          credentials: "include",
        });
    
        const data = await res.json();
        setChipotles(data);
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCsrf();
    fetchChipotles();
  }, []);

  const authPost = (url) =>
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "x-csrf-token": csrfToken },
    });

  const handleLike = async (e, chipotleId) => {
    e.preventDefault();
    const chip = chipotles.find((c) => c._id === chipotleId);
    const isLiked = chip.userLiked;
    const url = isLiked
      ? `http://localhost:3000/users/unlike/${chipotleId}`
      : `http://localhost:3000/users/like/${chipotleId}`;

    try {
      const res = await authPost(url);
      if (!res.ok) throw new Error("Failed");
      setChipotles((prev) =>
        prev.map((c) =>
          c._id === chipotleId
            ? {
                ...c,
                likes: isLiked ? c.likes - 1 : c.likes + 1,
                userLiked: !isLiked,
                dislikes: c.userDisliked ? c.dislikes - 1 : c.dislikes,
                userDisliked: false,
              }
            : c
        )
      );
    } catch (e) {
      console.error("Like error:", e);
    }
  };

  const handleDislike = async (e, chipotleId) => {
    e.preventDefault();
    const chip = chipotles.find((c) => c._id === chipotleId);
    const isDisliked = chip.userDisliked;
    const url = isDisliked
      ? `http://localhost:3000/users/undislike/${chipotleId}`
      : `http://localhost:3000/users/dislike/${chipotleId}`;

    try {
      const res = await authPost(url);
      if (!res.ok) throw new Error("Failed");
      setChipotles((prev) =>
        prev.map((c) =>
          c._id === chipotleId
            ? {
                ...c,
                dislikes: isDisliked ? c.dislikes - 1 : c.dislikes + 1,
                userDisliked: !isDisliked,
                likes: c.userLiked ? c.likes - 1 : c.likes,
                userLiked: false,
              }
            : c
        )
      );
    } catch (e) {
      console.error("Dislike error:", e);
    }
  };

  const filteredChipotles = chipotles.filter((chip) =>
    chip.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Find My Chipotle</h1>
      <input
        type="text"
        placeholder="Search by address/city"
        value={search}
        onChange={(e) => setSearch(e.target.value.trimStart())}
      />
      {loading ? (
        <p>Loading...</p>
      ) : search.length === 0 ? (
        <p>Enter a location!</p>
      ) : filteredChipotles.length === 0 ? (
        <p>No locations found</p>
      ) : (
        <ul className="chipotle-list">
          {filteredChipotles.map((chip) => (
            <li key={chip._id} className="chipotle-card">
              <Link to={`/chipotle/${chip._id}`}>
                <h3>{chip.location}</h3>
                <p>{chip.address}</p>
                <p>{chip.state}</p>
                <p>Rating: {chip.rating || "N/A"}</p>
              </Link>
              <div className="vote-buttons">
              <button
                onClick={(e) => handleLike(e, chip._id)}
                className={`vote-btn ${chip.userLiked ? "liked" : ""}`}
              >
                <FaThumbsUp /> {chip.likes}
              </button>
              <button
                onClick={(e) => handleDislike(e, chip._id)}
                className={`vote-btn ${chip.userDisliked ? "disliked" : ""}`}
              >
                <FaThumbsDown /> {chip.dislikes}
              </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChipotleList;