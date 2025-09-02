import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const loc = useLocation();

  return (
    <header className="nv">
      <div className="nv-inner">
        <div className="nv-left">
          <Link to="/" className="nv-brand">
            Smart Queue
          </Link>
          <nav className="nv-links">
            <Link
              className={`nv-link ${loc.pathname === "/" ? "active" : ""}`}
              to="/"
            >
              Home
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                className={`nv-link ${
                  loc.pathname.startsWith("/admin") ? "active" : ""
                }`}
                to="/admin"
              >
                Admin
              </Link>
            )}
            {user?.role === "STAFF" && (
              <Link
                className={`nv-link ${
                  loc.pathname.startsWith("/staff") ? "active" : ""
                }`}
                to="/staff"
              >
                Staff
              </Link>
            )}
          </nav>
        </div>
        <div className="nv-right">
          {!user ? (
            <div className="nv-actions">
              <Link className="nv-btn" to="/login">
                Login
              </Link>
              <Link className="nv-btn" to="/forgot-password">
                <LockIcon /> Forgot Password
              </Link>
            </div>
          ) : (
            <div className="nv-actions">
              <span className="nv-user">
                {user.username} · {user.role}
              </span>
              <Link className="nv-btn" to="/change-password">
                <KeyIcon /> Change Password
              </Link>
              <button className="nv-btn outline" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Simple SVG icons for password actions
const LockIcon = () => (
  <span className="nv-icon" role="img" aria-label="lock">
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "middle" }}
    >
      <path
        d="M5 8V6a5 5 0 0110 0v2"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="8"
        width="14"
        height="9"
        rx="2"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="13" r="1.5" fill="#fff" />
    </svg>
  </span>
);

const KeyIcon = () => (
  <span className="nv-icon" role="img" aria-label="key">
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "middle" }}
    >
      <circle cx="13" cy="13" r="5" stroke="#fff" strokeWidth="1.5" />
      <circle cx="13" cy="13" r="1.5" fill="#fff" />
      <path
        d="M13 8V3M13 3h-2m2 0h2"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

export default Navbar;
