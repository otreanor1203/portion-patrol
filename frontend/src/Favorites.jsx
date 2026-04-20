import { useEffect, useState } from "react";
import { apiUrl } from "./api.js";
import { Link } from "react-router-dom";
import "./App.css";

function Favorites() {
  const [chipotles, setChipotles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(apiUrl("/chipotles"), {
          credentials: "include",
        });

        const data = await res.json();

        const liked = Array.isArray(data)
          ? data.filter((chip) => chip.userLiked)
          : [];

        setChipotles(liked);
      } catch (e) {
        console.error("Error fetching favorites:", e);
        setChipotles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <p className="message">Loading favorites...</p>;
  }

  return (
    <div className="container">
      <h1>Favorite Chipotles</h1>

      {chipotles.length === 0 ? (
        <p className="message">
          Chipotles that you have liked will show up here!
        </p>
      ) : (
        <ul className="chipotle-list">
          {chipotles.map((chip) => (
            <li key={chip._id}>
              <Link
                to={`/chipotle/${chip._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="chipotle-card">
                  <h3>{chip.location}</h3>
                  <p>{chip.address}</p>
                  <p>{chip.likes} likes</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;