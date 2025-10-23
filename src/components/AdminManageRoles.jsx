import React, { useEffect, useState } from "react";
import { createUser, fetchUsers } from "../api";
import "../styles/AdminManageRoles.css";

const AdminManageRoles = ({ loading: parentLoading = false, onRefresh }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", role: "STAFF" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch users from API
  const loadUsers = async () => {
    try {
      setTableLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setMessage("Failed to fetch users.");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await createUser(form.username, form.email, form.role);
      setMessage("User created and credentials sent to email.");
      setForm({ username: "", email: "", role: "STAFF" });
      await loadUsers();
      if (onRefresh) onRefresh();
      setTimeout(() => setMessage(""), 5000); // Clear message after 5s
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Error creating user.";
      setMessage(errorMsg);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-roles-wrap">
      <div className="admin-header">
        <h2>Manage Roles</h2>
        <button
          className="admin-btn"
          style={{ marginLeft: 12 }}
          onClick={() => onRefresh && onRefresh()}
          disabled={parentLoading || tableLoading}
        >
          {tableLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {message && (
        <div
          className="admin-roles-message"
          style={{
            color: message.toLowerCase().includes("success")
              ? "#22c55e"
              : "#b00",
            marginBottom: 12,
          }}
        >
          {message}
        </div>
      )}

      <form className="admin-roles-form" onSubmit={handleSubmit}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
          disabled={loading}
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          disabled={loading}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="STAFF">STAFF</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create User"}
        </button>
      </form>

      <h3>All Users</h3>
      {tableLoading ? (
        <p>Loading users…</p>
      ) : (
        <table className="admin-roles-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((u) => (
                <tr key={u.id || u.email}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminManageRoles;
