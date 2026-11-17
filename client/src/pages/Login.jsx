import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);

      setMessage("Login successful!");

      navigate("/books");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back!</h1>
        <p>Login to your Book Catalog account.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
