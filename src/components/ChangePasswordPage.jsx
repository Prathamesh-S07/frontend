import React, { useState } from "react";
import { apiChangePassword } from "../api";
import { useAuth } from "../context/AuthContext";
// Key and check icons
const KeyIcon = () => (
  <span style={{ marginRight: 6, verticalAlign: "middle" }}>
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none">
      <circle cx="13" cy="13" r="5" stroke="#2563eb" strokeWidth="1.5" />
      <circle cx="13" cy="13" r="1.5" fill="#2563eb" />
      <path
        d="M13 8V3M13 3h-2m2 0h2"
        stroke="#2563eb"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiChangePassword(oldPassword, newPassword, user?.role);
      setMessage(res);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="change-password-page"
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
          <KeyIcon />
          Change Password
        </h2>
        <form onSubmit={handleChangePassword}>
          <label style={{ fontWeight: 500 }}>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 16,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #cbd5e1",
            }}
            placeholder="Enter old password"
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
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
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
            {message.toLowerCase().includes("success") && <CheckIcon />}
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordPage;
