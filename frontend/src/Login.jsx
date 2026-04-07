import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate(); 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser, setCurrentUser, csrfToken } = useContext(AuthContext);


  const handleLogin = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("Cannot submit empty fields.");
      return;
    }

    if (!csrfToken) {
      setMessage("Security token is missing. Please refresh and try again.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/login",
        { username, password },
        { withCredentials: true,
          headers: { "x-csrf-token": csrfToken }
        }
      );

      setMessage("Login successful");
      onLoginSuccess?.();

      navigate("/account"); 
    } catch (e) {
      setMessage(e.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

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

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}