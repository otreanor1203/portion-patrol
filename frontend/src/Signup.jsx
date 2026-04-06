import { useState } from "react";
import axios from "axios";

export default function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("Cannot submit empty fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/register",
        { username, password },
        { withCredentials: true }
      );

      setMessage("Signup successful");
      onSignupSuccess?.();
    } catch (e) {
      setMessage(e.response?.data?.error || "Signup failed");
    }
  };

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