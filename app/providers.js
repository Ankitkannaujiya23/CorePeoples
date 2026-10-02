"use client";

import { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { makeStore } from "@/store";
import { bootstrapFromStorage } from "@/store/slices/authSlice";
import { bootstrapVotes } from "@/store/slices/voteSlice";
import {
  campaignsRequestFailed,
  campaignsRequestStarted,
  setCampaigns,
} from "@/store/slices/campaignSlice";
import {
  setEmployeesFailed,
  setEmployeesLoading,
  setEmployees,
} from "@/store/slices/organizationSlice";
import { AUTH_STORAGE_KEY } from "@/lib/constants";
import { campaignService } from "@/services/campaignService";
import { employeeService } from "@/services/employeeService";

import ToastHost from "@/components/ui/Toast";

function Bootstrap({ children }) {
  const dispatch = useDispatch();
  const bootstrapped = useSelector((s) => s.auth.bootstrapped);

  useEffect(() => {
    let storedUser = null;
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      storedUser = raw ? JSON.parse(raw) : null;
    } catch {
      storedUser = null;
    }
    dispatch(bootstrapFromStorage(storedUser));
    dispatch(bootstrapVotes());

    async function loadInitialData() {
      dispatch(campaignsRequestStarted());
      dispatch(setEmployeesLoading(true));

      try {
        const [campaigns, employees] = await Promise.all([
          campaignService.getCampaigns(),
          employeeService.getEmployees(),
        ]);
        dispatch(setCampaigns(campaigns));
        dispatch(setEmployees(employees));
      } catch (err) {
        dispatch(campaignsRequestFailed(err.message));
        dispatch(setEmployeesFailed(err.message));
      }
    }

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!bootstrapped) return null;
  return children;
}

export default function Providers({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <Bootstrap>{children}</Bootstrap>
      <ToastHost />
    </Provider>
  );
}
