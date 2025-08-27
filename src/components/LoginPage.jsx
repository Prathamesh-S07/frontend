import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../api";
import "../styles/LoginPage.css";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const { setUserFromToken } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // backend returns { jwt: "xxx", role: "ADMIN" }
      const { jwt, role } = await apiLogin(form.username, form.password);

      // Validate JWT: check existence, decode, and expiry
      if (!jwt) {
        setError("Login failed: No token received.");
        return;
      }
      let decoded;
      try {
        decoded = jwtDecode(jwt);
      } catch {
        setError("Login failed: Invalid token received.");
        return;
      }
      // Check expiry (exp is in seconds)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        setError("Login failed: Token is expired.");
        return;
      }

      setUserFromToken(jwt);

      if (role === "ADMIN") nav("/admin", { replace: true });
      else if (role === "STAFF") nav("/staff", { replace: true });
      else nav(from, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h2 className="login-title">Sign In</h2>

        <label className="login-label">
          Username
          <input
            className="login-input improved-input"
            type="text"
            name="username"
            value={form.username}
            onChange={onChange}
            required
            autoComplete="username"
          />
        </label>

        <label className="login-label">
          Password
          <input
            className="login-input improved-input"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
