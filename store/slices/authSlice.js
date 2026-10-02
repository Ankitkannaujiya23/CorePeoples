import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STORAGE_KEY } from "@/lib/constants";

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  bootstrapped: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    bootstrapFromStorage(state, action) {
      const user = action.payload;
      if (user) {
        state.user = user;
        state.role = user.role;
        state.isAuthenticated = true;
      }
      state.bootstrapped = true;
    },
    authRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },
    authRequestSucceeded(state, action) {
      const user = action.payload;
      state.status = "succeeded";
      state.user = user;
      state.role = user.role;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      }
    },
    authRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload || "Something went wrong.";
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  bootstrapFromStorage,
  authRequestStarted,
  authRequestSucceeded,
  authRequestFailed,
  logout,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
