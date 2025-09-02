import axios from "axios";

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
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const apiLogin = async (username, password) => {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data;
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

// ---- Counters ----
// ADMIN endpoints
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
// Assign staff to counter (admin only)
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
// STAFF endpoints
export const fetchAssignedCounter = async () => {
  const { data } = await api.get("/api/counters/assigned");
  return data;
};
// Public GET for all counters
export const fetchCounters = async () => {
  const { data } = await api.get("/api/counters/all");
  return data;
};

export const fetchAllQueues = async () => {
  const { data } = await api.get("/api/queues/all");
  return data;
};

export const fetchQueuesByCounter = async (counterId) => {
  const { data } = await api.get(`/api/queue/${counterId}`);
  return Array.isArray(data) ? data : [];
};

export const joinQueue = async ({ name, counterId }) => {
  const { data } = await api.post(`/api/queue/join/${counterId}`, {
    userName: name,
    counterId,
  });
  return data;
};

export const fetchQueueById = async (id) => {
  const { data } = await api.get(`/api/queue/entry/${id}`);
  return data;
};

// Mark served (admin/staff only)
export const markServed = async (id) => {
  const { data } = await api.put(`/api/queue/serve/${id}`);
  return data;
};

// ---- Staff ----
// Fetch all staff (admin only)
export const fetchAllStaff = async () => {
  const { data } = await api.get("/api/admin/staff");
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

// ---- Users (Admin) ----
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
