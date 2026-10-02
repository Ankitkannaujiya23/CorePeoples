import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { HiCheckCircle } from "react-icons/hi2";

export default function CandidateCard({ candidate, selected, onSelect, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(candidate.id)}
      disabled={disabled}
      className={cn(
        "group relative flex flex-col items-center rounded-2xl border bg-white p-6 text-center transition-all duration-200 focus-ring",
        selected
          ? "border-bronze-500 ring-2 ring-bronze-500/30 shadow-card"
          : "border-line-100 hover:border-line-200 hover:shadow-card hover:-translate-y-0.5",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {selected && (
        <HiCheckCircle className="absolute right-4 top-4 h-6 w-6 text-bronze-500 animate-scale-in" />
      )}
      <Avatar name={candidate.name} color={candidate.avatarColor} size="xl" />
      <h3 className="mt-4 text-[15px] font-semibold text-ink-900">{candidate.name}</h3>
      <p className="text-xs text-ink-500">{candidate.role}</p>
      <p className="mt-3 text-sm text-ink-600 leading-relaxed">&ldquo;{candidate.blurb}&rdquo;</p>

      <span
        className={cn(
          "mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors",
          selected
            ? "bg-bronze-500 text-white"
            : "bg-surface-100 text-ink-700 group-hover:bg-ink-900 group-hover:text-white"
        )}
      >
        {selected ? "Selected" : "Select"}
      </span>
    </button>
  );
}
