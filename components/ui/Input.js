import { cn } from "@/lib/utils";

export function Field({ label, htmlFor, error, hint, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-800">
          {label} {required && <span className="text-bronze-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

export default function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/70 transition-colors duration-150 focus-ring",
        error ? "border-danger-500" : "border-line-200 focus:border-ink-700",
        className
      )}
      {...props}
    />
  );
}
