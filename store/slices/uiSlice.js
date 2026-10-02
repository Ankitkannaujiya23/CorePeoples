import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false, // mobile drawer
  toasts: [], // [{ id, type, message }]
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    showToast: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ message, type = "success" }) {
        return { payload: { id: nanoid(6), message, type } };
      },
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleSidebar, closeSidebar, showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
