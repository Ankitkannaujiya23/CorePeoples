import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import organizationReducer from "./slices/organizationSlice";
import campaignReducer from "./slices/campaignSlice";
import employeeReducer from "./slices/employeeSlice";
import voteReducer from "./slices/voteSlice";
import uiReducer from "./slices/uiSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      organization: organizationReducer,
      campaigns: campaignReducer,
      employeeDirectory: employeeReducer,
      votes: voteReducer,
      ui: uiReducer,
    },
  });
}
