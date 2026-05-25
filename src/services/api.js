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
export const loginUser = (payload) => request(() => api.post("/api/auth/login", payload));
export const logoutUser = () => request(() => api.post("/api/auth/logout"));
export const getMe = () => request(() => api.get("/api/auth/me"));
export const updateProfile = (payload) => request(() => api.patch("/api/auth/profile", payload));

// Transactions
export const getQueue = (params) =>
  request(() => api.get("/api/transactions", { params }));

// Decisions
export const getDecisions = (params) => request(() => api.get("/api/decisions", { params }));
export const createDecision = (payload) =>
  request(() => api.post("/api/decisions", payload));

// Fraud DS (via nuestro back)
export const decideTransaction = (payload) =>  request(() => api.post("/api/fraud/decide", payload));
export const getChallengeRecommendation = (payload) => request(() => api.post("/api/fraud/challenge", payload));
export const sendFeedback = (payload) =>  request(() => api.post("/api/fraud/feedback", payload));

// Stats
export const getDashboardStats = () => request(() => api.get("/api/stats"));
export const getDSStats = () => request(() => api.get("/api/stats/ds"));
export const previewThreshold = (payload) => request(() => api.post("/api/fraud/preview", payload));
export const getHistoryStats = () => request(() => api.get("/api/stats/history"));

// Clients
export const getClientProfile = (nameOrig) => request(() => api.get(`/api/clients/${nameOrig}`));

export default api;
