"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissToast } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi2";

const icons = {
  success: <HiCheckCircle className="h-5 w-5 text-success-500" />,
  error: <HiXCircle className="h-5 w-5 text-danger-500" />,
  info: <HiInformationCircle className="h-5 w-5 text-ink-700" />,
};

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(toast.id)), 4000);
    return () => clearTimeout(t);
  }, [toast.id, dispatch]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-line-100 bg-white px-4 py-3 shadow-pop animate-scale-in min-w-[280px] max-w-sm"
      )}
      role="status"
    >
      {icons[toast.type] || icons.info}
      <p className="text-sm text-ink-800 leading-snug">{toast.message}</p>
      <button
        onClick={() => dispatch(dismissToast(toast.id))}
        className="ml-auto text-ink-500 hover:text-ink-900 focus-ring rounded"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export default function ToastHost() {
  const toasts = useSelector((s) => s.ui.toasts);
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
