import { createSlice } from "@reduxjs/toolkit";
import { organization as mockOrganization } from "@/data/organizations";

const initialState = {
  organization: mockOrganization,
  employees: [],
  status: "idle",
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganization(state, action) {
      state.organization = action.payload;
    },
    setEmployeesLoading(state) {
      state.status = "loading";
    },
    setEmployees(state, action) {
      state.employees = action.payload;
      state.status = "succeeded";
    },
    setEmployeesFailed(state) {
      state.status = "failed";
    },
    addEmployee(state, action) {
      state.employees.push(action.payload);
    },
    updateEmployeeStatusInStore(state, action) {
      const emp = state.employees.find((e) => e.id === action.payload.id);
      if (emp) emp.isActive = action.payload.isActive;
    },
    updateEmployeeEmailInStore(state, action) {
      const emp = state.employees.find((e) => e.id === action.payload.id);
      if (emp && action.payload.email) emp.email = action.payload.email;
    },
  },
});

export const {
  setOrganization,
  setEmployeesLoading,
  setEmployees,
  setEmployeesFailed,
  addEmployee,
  updateEmployeeStatusInStore,
  updateEmployeeEmailInStore,
} = organizationSlice.actions;

export default organizationSlice.reducer;