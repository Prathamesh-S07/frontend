import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import { apiSignup } from "../api";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "STAFF",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const nav = useNavigate();

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiSignup(form.username, form.email, form.password, form.role);
      setSuccess("Signup successful! You can now log in.");
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h2 className="login-title">Sign Up</h2>
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
          Email
          <input
            className="login-input improved-input"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
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
            autoComplete="new-password"
          />
        </label>
        <label className="login-label">
          Role
          <select
            className="login-input improved-input"
            name="role"
            value={form.role}
            onChange={onChange}
            required
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        <button className="login-btn" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
