import { useEffect, useState } from "react";
import "./App.css";

function ChipotleList() {
  const [chipotles, setChipotles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChipotles = async () => {
      try {
        const res = await fetch("http://localhost:3000/chipotles");
        const data = await res.json();
        setChipotles(data);
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchChipotles();
  }, []);

  const filteredChipotles = chipotles.filter((chip) =>
    chip.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Find My Chipotle</h1>

      <input
        type="text"
        placeholder="Search by city"
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
            {/* Slicing for now for display just making sure it works */}
          {filteredChipotles.slice(0,2).map((chip) => (
            <li key={chip._id} className="chipotle-card">
              <h3>{chip.location}</h3>
              <p>{chip.address}</p>
              <p>{chip.state}</p>
              <p>Rating: {chip.rating || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChipotleList;