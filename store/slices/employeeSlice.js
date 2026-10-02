import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  departmentFilter: "all",
};

const employeeSlice = createSlice({
  name: "employeeDirectory",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setDepartmentFilter(state, action) {
      state.departmentFilter = action.payload;
    },
  },
});

export const { setSearchQuery, setDepartmentFilter } = employeeSlice.actions;
export default employeeSlice.reducer;
