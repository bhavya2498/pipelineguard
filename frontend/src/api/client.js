import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Request interceptor to automatically attach current user role and identification
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("pipelineguard_user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.role) config.headers["x-user-role"] = user.role;
      if (user?.email) config.headers["x-user-email"] = user.email;
    }
  } catch (e) {
    // Ignore JSON parse errors
  }
  return config;
});

// Pipelines
export const getPipelines = () => api.get("/pipelines").then((r) => r.data);
export const getPipeline = (id) => api.get(`/pipelines/${id}`).then((r) => r.data);
export const createPipeline = (data) => api.post("/pipelines", data).then((r) => r.data);
export const updatePipeline = (id, data) => api.put(`/pipelines/${id}`, data).then((r) => r.data);
export const deletePipeline = (id) => api.delete(`/pipelines/${id}`).then((r) => r.data);

// Monitoring
export const getMonitoring = (params) => api.get("/monitoring", { params }).then((r) => r.data);
export const postMonitoring = (data) => api.post("/monitoring", data).then((r) => r.data);

// Alerts
export const getAlerts = (params) => api.get("/alerts", { params }).then((r) => r.data);
export const createAlert = (data) => api.post("/alerts", data).then((r) => r.data);
export const patchAlert = (id, data) => api.patch(`/alerts/${id}`, data).then((r) => r.data);

// Inspections
export const getInspections = (params) => api.get("/inspections", { params }).then((r) => r.data);
export const createInspection = (data) => api.post("/inspections", data).then((r) => r.data);
export const updateInspection = (id, data) => api.put(`/inspections/${id}`, data).then((r) => r.data);

// Maintenance
export const getMaintenance = (params) => api.get("/maintenance", { params }).then((r) => r.data);
export const createMaintenance = (data) => api.post("/maintenance", data).then((r) => r.data);
export const patchMaintenance = (id, data) => api.patch(`/maintenance/${id}`, data).then((r) => r.data);

// Simulation & History
export const runSimulation = (data) => api.post("/simulation", data).then((r) => r.data);
export const getSimulations = (params) => api.get("/simulations", { params }).then((r) => r.data);

// Authentication & Users
export const loginUser = (credentials) => api.post("/users/login", credentials).then((r) => r.data);
export const registerUser = (userData) => api.post("/users/register", userData).then((r) => r.data);
export const getUsers = () => api.get("/users").then((r) => r.data);
export const updateUserRole = (id, role) => api.patch(`/users/${id}/role`, { role }).then((r) => r.data);

// Auth storage helpers
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("pipelineguard_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem("pipelineguard_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("pipelineguard_user");
  }
  // Dispatch a custom storage event so components update immediately
  window.dispatchEvent(new Event("userRoleChanged"));
};

export const logoutUser = () => {
  localStorage.removeItem("pipelineguard_user");
  window.dispatchEvent(new Event("userRoleChanged"));
};

export default api;
