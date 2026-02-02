import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

/* REQUEST INTERCEPTOR → attach token */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Remove Content-Type header for FormData - axios will set it automatically with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

/* RESPONSE INTERCEPTOR → handle global errors */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Auto logout on 401
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Prevent infinite loop: Don't redirect if already on login page
      if (window.location.pathname === "/salon-login") {
        return Promise.reject(error);
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("lastProtectedRoute");
      localStorage.removeItem("redirectAfterLogin");
      import("../components/ui/toast").then(({ showToast }) => {
        // showToast({
        //   message: 'Please login again.',
        //   status: 'error',
        // });
      });
      window.location.href = "/salon-login";
    }

    // Preserve the original error object so error.response is still accessible
    return Promise.reject(error);
  },
);

export default api;
