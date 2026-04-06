import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate(); 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("Cannot submit empty fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/login",
        { username, password },
        { withCredentials: true }
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