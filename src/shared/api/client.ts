import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5109",
  withCredentials: true, // send refreshToken HttpOnly cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach access token from memory ──────────────
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.__accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: handle 401 → try refresh, 403 → stay ────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // RefreshToken cookie is sent automatically (HttpOnly)
        const { data } = await apiClient.post<{ accessToken: string }>(
          "/api/auth/refresh-token"
        );
        const newToken = data.accessToken;
        if (typeof window !== "undefined") {
          window.__accessToken = newToken;
        }
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          window.__accessToken = undefined;
          if (process.env.NODE_ENV !== "development") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Augment Window type for access token storage
declare global {
  interface Window {
    __accessToken?: string;
  }
}

export default apiClient;
