import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

const request = async (callback) => {
  try {
    const response = await callback();
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Ha ocurrido un error con la API";
    throw new Error(message, { cause: error });
  }
};

// Auth
export const loginUser = (payload) =>
  request(() => api.post("/api/auth/login", payload));
export const logoutUser = () => request(() => api.post("/api/auth/logout"));
export const getMe = () => request(() => api.get("/api/auth/me"));

// Transactions
export const getQueue = (params) =>
  request(() => api.get("/api/transactions", { params }));
export const getTransactionById = (id) =>
  request(() => api.get(`/api/transactions/${id}`));

// Decisions
export const getDecisions = () => request(() => api.get("/api/decisions"));
export const createDecision = (payload) =>
  request(() => api.post("/api/decisions", payload));

// Stats
export const getDashboardStats = () => request(() => api.get("/api/stats"));

export default api;
