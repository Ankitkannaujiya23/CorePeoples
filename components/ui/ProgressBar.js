import { cn } from "@/lib/utils";

export default function ProgressBar({ value = 0, tone = "ink", size = "md", showLabel = false }) {
  const tones = {
    ink: "bg-ink-900",
    accent: "bg-bronze-500",
    success: "bg-success-500",
  };
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className="w-full">
      <div className={cn("w-full overflow-hidden rounded-full bg-surface-200", heights[size])}>
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", tones[tone])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && <p className="mt-1 text-xs text-ink-500">{value}%</p>}
    </div>
  );
}
