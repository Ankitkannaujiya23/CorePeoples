import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-600 shadow-subtle",
  accent:
    "bg-bronze-500 text-white hover:bg-bronze-600 disabled:bg-bronze-300 shadow-subtle",
  secondary:
    "bg-white text-ink-900 border border-line-200 hover:bg-surface-100 disabled:opacity-50",
  ghost: "text-ink-700 hover:bg-surface-100 disabled:opacity-50",
  danger: "bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-500/50",
};

const sizes = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "text-[15px] px-5 py-3 rounded-xl gap-2",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  loading = false,
  disabled,
  ...props
}) {
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 focus-ring active:scale-[0.98] whitespace-nowrap disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </Comp>
  );
}
