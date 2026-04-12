import "./App.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

export default function Requests() {
  const [loading, setLoading] = useState(true);
  const { currentUser, csrfToken } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  if (!currentUser || !currentUser.admin) {
    return <h1>Access Denied</h1>;
  }

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch("http://localhost:3000/requests", {
          method: "GET",
          credentials: "include",
          headers: { "x-csrf-token": csrfToken },
        });
        const data = await response.json();
        console.log("Requests:", data);
        setRequests(data);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch requests:", e);
      }
    }
    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Chipotle Location Requests</h1>
      {!requests.length ? (
        <p>No requests found.</p>
      ) : (
        <ul className="chipotle-list">
          {requests.map((request) => (
            <li className="chipotle-card" key={request.id}>
              <h3>{request.location}</h3>
              <p>{request.address}</p>
              <p>{request.state}</p>
              <button type="button" class="btn btn-success green">
                Accept
              </button>
              <button type="button" class="btn btn-danger red">
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
