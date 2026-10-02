import axios from "axios";
import { AUTH_STORAGE_KEY } from "@/lib/constants";

export const MOCK_MODE = false;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

client.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const rawUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawUser) return config;

  try {
    const user = JSON.parse(rawUser);
    const token = user?.token || user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong.";

    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return Promise.reject(new Error(message));
  }
);

export const api = {
  client,
  get: async (path, config) => (await client.get(path, config)).data,
  post: async (path, data, config) => (await client.post(path, data, config)).data,
  patch: async (path, data, config) => (await client.patch(path, data, config)).data,
  delete: async (path, config) => (await client.delete(path, config)).data,
};
