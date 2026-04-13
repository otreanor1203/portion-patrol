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

  const handleAccept = async (id, state, location, address) => {
    try {
      const response = await fetch("http://localhost:3000/chipotles", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ id, state, location, address }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to accept chipotle request");
      }

      setRequests((prev) => prev.filter((chip) => chip._id !== id));
      alert("Chipotle accepted");
    } catch (error) {
      alert(error.message || "Error accepting chipotle");
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await fetch("http://localhost:3000/requests/" + id, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to decline chipotle request",
        );
      }

      setRequests((prev) => prev.filter((chip) => chip._id !== id));
      alert("Chipotle declined");
    } catch (error) {
      alert(error.message || "Error declining chipotle");
    }
  };

  useEffect(() => {
    async function fetchRequests() {
      try {
        if (!csrfToken) {
          return;
        }

        const response = await fetch("http://localhost:3000/requests", {
          method: "GET",
          credentials: "include",
          headers: { "x-csrf-token": csrfToken },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (e) {
        console.error("Failed to fetch requests:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [csrfToken]);

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
            <li className="chipotle-card" key={request._id}>
              <h3>{request.location}</h3>
              <p>{request.address}</p>
              <p>{request.state}</p>
              <button
                type="button"
                className="btn btn-success green"
                onClick={() =>
                  handleAccept(
                    request._id,
                    request.state,
                    request.location,
                    request.address,
                  )
                }
              >
                Accept
              </button>
              <button
                type="button"
                className="btn btn-danger red"
                onClick={() => handleDecline(request._id)}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
