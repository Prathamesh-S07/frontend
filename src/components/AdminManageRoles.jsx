import React, { useEffect, useState } from "react";
import { createUser, fetchUsers } from "../api";
import "../styles/AdminManageRoles.css";

const AdminManageRoles = ({ loading, onRefresh }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", role: "STAFF" });
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(form.username, form.email, form.role);
      setMessage("User created and credentials sent to email.");
      setForm({ username: "", email: "", role: "STAFF" });
      loadUsers();
      if (onRefresh) onRefresh();
    } catch (err) {
      setMessage(err.response?.data || "Error creating user.");
    }
  };

  return (
    <div className="admin-roles-wrap">
      <div className="admin-header">
        <h2>Manage Roles</h2>
        {!loading && (
          <button
            className="admin-btn"
            style={{ marginLeft: 12 }}
            onClick={onRefresh}
          >
            Refresh
          </button>
        )}
        {loading && <span className="admin-pill">Refreshing…</span>}
      </div>
      <form className="admin-roles-form" onSubmit={handleSubmit}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="STAFF">STAFF</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Create User</button>
      </form>
      {message && <div className="admin-roles-message">{message}</div>}
      <h3>All Users</h3>
      <table className="admin-roles-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageRoles;
