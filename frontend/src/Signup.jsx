import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { apiUrl } from "./api.js";

export default function Signup({ }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser, setCurrentUser, csrfToken } = useContext(AuthContext);


  const handleSignup = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("Cannot submit empty fields.");
      return;
    }

    if (!csrfToken) {
      setMessage("Security token is missing. Please refresh and try again.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        apiUrl("/register"),
        { username, password },
        { 
          withCredentials: true,
          headers: { "x-csrf-token": csrfToken }
        }
      );

      setMessage("Signup successful");
    } catch (e) {
      setMessage(e.response?.data?.error || "Signup failed");
    }
  };

    if (currentUser) {
      return <Navigate to="/account" />;
    }

  return (
    <div className="container">
      <h1>Sign Up</h1>

      {message && <p className="message">{message}</p>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}