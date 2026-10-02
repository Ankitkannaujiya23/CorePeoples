import { cn } from "@/lib/utils";

const styles = {
  active: "bg-success-50 text-success-600",
  draft: "bg-ink-100 text-ink-600 bg-surface-200",
  completed: "bg-ink-900/5 text-ink-700",
  paused: "bg-warning-50 text-warning-600",
  neutral: "bg-surface-200 text-ink-700",
  accent: "bg-bronze-50 text-bronze-600",
};

export default function Badge({ children, tone = "neutral", className, dot = false }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[tone] || styles.neutral,
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
