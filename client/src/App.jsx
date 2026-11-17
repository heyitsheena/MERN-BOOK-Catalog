import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import api from "./api/axios";

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        await api.get("/auth/me");
        setIsValid(true);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsValid(false);
      }
    }

    checkLogin();
  }, []);

  if (isValid === null) {
    return <p>Checking login...</p>;
  }

  return isValid ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
