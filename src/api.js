import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://backend-hhni.onrender.com");

// Axios instance for protected endpoints
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage to all requests
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

  const { data } = await api.post(url, { oldPassword, newPassword });
  return data;
};

export const apiForgotPassword = async (email) => {
  const { data } = await publicApi.post("/api/auth/forgot-password", { email });
  return data;
};

export const apiResetPassword = async (email, code, newPassword) => {
  const { data } = await publicApi.post("/api/auth/reset-password", {
    email,
    code,
    newPassword,
  });
  return data;
};

// ---- Admin Endpoints ----
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

export const assignStaffToCounter = async (counterId, staffId) => {
  const { data } = await api.put(
    `/api/admin/counters/${counterId}/assign-staff`,
    null,
    { params: { staffId } }
  );
  return data;
};

export const fetchAllStaff = async () => {
  const { data } = await api.get("/api/admin/staff");
  return data;
};

export const fetchUsers = async () => {
  const { data } = await api.get("/api/admin/users");
  return data;
};

export const createUser = async (username, email, role) => {
  const { data } = await api.post("/api/admin/create-user", {
    username,
    email,
    role,
  });
  return data;
};

// ---- Staff Endpoints ----
export const fetchAssignedCounter = async () => {
  const { data } = await api.get("/counters/assigned");
  return data;
};

// ---- Queue Endpoints ----
export const fetchAllQueues = async () => {
  const { data } = await api.get("/queues/all");
  return data;
};

export const fetchQueuesByCounter = async (counterId) => {
  const { data } = await api.get(`/queue/${counterId}`);
  return Array.isArray(data) ? data : [];
};

export const joinQueue = async ({ name, counterId }) => {
  const { data } = await api.post(`/queue/join/${counterId}`, {
    userName: name,
  });
  return data;
};

export const fetchQueueById = async (id) => {
  const { data } = await api.get(`/queue/entry/${id}`);
  return data;
};

export const markServed = async (id) => {
  const { data } = await api.put(`/queue/serve/${id}`);
  return data;
};

// ---- Reports (Admin) ----
export const filterQueues = async ({ startDate, endDate }) => {
  const { data } = await api.get("/api/admin/reports/filter", {
    params: { startDate, endDate },
  });
  return data;
};

export const downloadQueuesExcel = async ({ startDate, endDate }) => {
  const response = await api.get("/api/admin/reports/download", {
    params: { startDate, endDate },
    responseType: "blob",
  });
  return response.data;
};

// ---- Public GET for counters ----
export const fetchCounters = async () => {
  const { data } = await axios.get(`${BASE_URL}/counters/all`);
  return data;
};

export default api;
