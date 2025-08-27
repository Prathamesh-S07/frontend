import React, { useState } from "react";
import { apiForgotPassword, apiResetPassword } from "../api";
// Simple lock and check icons
const LockIcon = () => (
  <span style={{ marginRight: 6, verticalAlign: "middle" }}>
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 8V6a5 5 0 0110 0v2"
        stroke="#2563eb"
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
        stroke="#2563eb"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="13" r="1.5" fill="#2563eb" />
    </svg>
  </span>
);
const CheckIcon = () => (
  <span style={{ marginRight: 6, verticalAlign: "middle" }}>
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#22c55e" />
      <path
        d="M6 10.5l3 3 5-5"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter code/new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiForgotPassword(email);
      setMessage(res);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiResetPassword(email, code, newPassword);
      setMessage(res);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-password-page"
      style={{ maxWidth: 400, margin: "40px auto" }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px #0001",
          padding: 32,
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          <LockIcon />
          Forgot Password
        </h2>
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <label style={{ fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                marginBottom: 16,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #cbd5e1",
              }}
              placeholder="Enter your registered email"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: 10,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <label style={{ fontWeight: 500 }}>
              Reset Code (check your email)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{
                width: "100%",
                marginBottom: 16,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #cbd5e1",
              }}
              placeholder="6-digit code"
            />
            <label style={{ fontWeight: 500 }}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: "100%",
                marginBottom: 16,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #cbd5e1",
              }}
              placeholder="Enter new password"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: 10,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ color: "#22c55e", fontWeight: 600, fontSize: 18 }}>
              <CheckIcon />
              Password reset successful.
            </p>
            <p style={{ marginTop: 8 }}>
              You may now{" "}
              <a
                href="/login"
                style={{ color: "#2563eb", textDecoration: "underline" }}
              >
                log in
              </a>
              .
            </p>
          </div>
        )}
        {message && (
          <div
            style={{
              marginTop: 18,
              color: message.toLowerCase().includes("success")
                ? "#22c55e"
                : "#b00",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
