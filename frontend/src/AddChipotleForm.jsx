import "./App.css";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { apiUrl } from "./api.js";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function AddChipotleForm() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const { currentUser, csrfToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        apiUrl("/requests"),
        {
          state: state,
          location: city,
          address: address,
        },
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } },
      );
      alert("Chipotle requests successfully!");
    } catch (e) {
      alert(
        "Failed to submit Chipotle request: " +
          (e.response?.data?.error || e.message),
      );
    }
  };

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <h1>Request a Chipotle Location</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a state
          </option>
          {US_STATES.map((stateName) => (
            <option key={stateName} value={stateName}>
              {stateName}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
