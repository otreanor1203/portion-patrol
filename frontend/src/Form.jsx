import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

export default function AuthForm() {
  const [formType, setFormType] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const handleSubmit = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("Cannot submit empty fields.");
      return;
    }

    try {
      if (formType === "signup") {
        if (password !== confirmPassword) {
          setMessage("Passwords do not match");
          return;
        }

        await axios.post(
          "http://localhost:3000/register",
          { username, password },
          { withCredentials: true },
        );

        setMessage("Signup successful");
      } else {
        const response = await axios.post(
          "http://localhost:3000/login",
          { username, password },
          { withCredentials: true },
        );

        setUsername("");
        setPassword("");
        setConfirmPassword("");

        setMessage("Login successful");
        setCurrentUser(response.data);
      }
    } catch (e) {
      console.error(e);
      setMessage(e.response?.data?.error || "Request failed");
    }
  };

  if (currentUser) {
    return (
      <div className="container">
        <h1>Portion Patrol</h1>
        <p>You are logged in</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Portion Patrol</h1>

      <div>
        <button onClick={() => setFormType("login")}>Login</button>
        <button onClick={() => setFormType("signup")}>Sign Up</button>
      </div>

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

      {formType === "signup" && (
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}

      <button onClick={handleSubmit}>Enter</button>
    </div>
  );
}
