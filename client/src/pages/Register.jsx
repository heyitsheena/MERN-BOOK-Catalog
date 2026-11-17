import { useState } from "react";
import api from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
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
      const response = await api.post("/auth/register", {
        username: name,
        email,
        password,
      });

      setMessage(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Create Account</h1>
        <p>Join our Book Catalog today!</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">Register</button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
