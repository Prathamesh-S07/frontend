import axios from "axios";
import { getUserRole } from "./context/AuthContext";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://backend-8bya.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt"); // match backend key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const apiLogin = async (username, password) => {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data; // { token, role, username }
};

export const apiChangePassword = async (oldPassword, newPassword, role) => {
  let url = "/api/auth/change-password";
  if (role === "ADMIN") url = "/api/auth/admin/change-password";
  else if (role === "STAFF") url = "/api/auth/staff/change-password";
  else if (role === "CUSTOMER") url = "/api/auth/customer/change-password";
  const { data } = await api.post(url, {
    oldPassword,
    newPassword,
  });
  return data;
};

export const apiForgotPassword = async (email) => {
  const { data } = await api.post("/api/auth/forgot-password", { email });
  return data;
};

export const apiResetPassword = async (email, code, newPassword) => {
  const { data } = await api.post("/api/auth/reset-password", {
    email,
    code,
    newPassword,
  });
  return data;
};

// ADMIN-only endpoints (AdminDashboard)
export const fetchAdminCounters = async () => {
  const { data } = await api.get("/api/admin/counters");
  return data;
};
export const createAdminCounter = async (payload) => {
  const { data } = await api.post("/api/admin/counters", payload);
  return data;
};
export const deleteAdminCounter = async (id) => {
  const { data } = await api.delete(`/api/admin/counters/${id}`);
  return data;
};

// General counters (for STAFF, CUSTOMER, QueueForm, StaffDashboard)
export const fetchCounters = async () => {
  const { data } = await api.get("/api/counters/all");
  return data;
};

// ---- Queues ----
export const joinQueue = async ({ name, counterId }) => {
  // Backend expects /api/queue/join/{counterId} with POST
  const { data } = await api.post(`/api/queue/join/${counterId}`, {
    userName: name,
    counterId,
  });
  return data;
};

export const fetchQueuesByCounter = async (counterId) => {
  const { data } = await api.get(`/api/queue/${counterId}`);
  return Array.isArray(data) ? data : [];
};

export const markServed = async (id) => {
  // Backend expects PUT /api/queue/serve/{queueId}
  const { data } = await api.put(`/api/queue/serve/${id}`);
  return data;
};

export const fetchQueueById = async (id) => {
  try {
    const { data } = await api.get(`/api/queue/entry/${id}`);
    return data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }
    if (e.response && e.response.status === 404) {
      throw new Error("Ticket not found.");
    }
    throw new Error("Unable to load ticket status.");
  }
};

export const fetchAllQueues = async () => {
  const { data } = await api.get("/api/queues/all");
  return data;
};

// Fetch all staff (for admin assignment)
export const fetchAllStaff = async () => {
  const { data } = await api.get("/api/admin/staff");
  return data;
};

// Assign staff to counter
export const assignStaffToCounter = async (counterId, staffId) => {
  const { data } = await api.put(
    `/api/admin/counters/${counterId}/assign-staff`,
    null,
    {
      params: { staffId },
    }
  );
  return data;
};

// Get queues for staff from assigned counter
export const fetchAssignedCounter = async () => {
  const { data } = await api.get("/api/counters/assigned");
  return data;
};

// ---- Reports (Admin) ----
export const filterQueues = async ({ startDate, endDate }) => {
  const { data } = await api.get(`/api/admin/reports/filter`, {
    params: { startDate, endDate },
  });
  return data;
};

export const downloadQueuesExcel = async ({ startDate, endDate }) => {
  const response = await api.get(`/api/admin/reports/download`, {
    params: { startDate, endDate },
    responseType: "blob",
  });
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get("/api/admin/users");
  return response.data;
};

export const createUser = async (username, email, role) => {
  const response = await api.post("/api/admin/create-user", {
    username,
    email,
    role,
  });
  return response.data;
};

export default api;
