import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import { pct } from "@/lib/utils";

export default function Leaderboard({ candidates, votes, totalVotesCount }) {
  const ranked = [...candidates]
    .map((c) => ({ ...c, voteCount: votes[c.id] || 0 }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="divide-y divide-line-100">
      {ranked.map((c, i) => (
        <div key={c.id} className="flex items-center gap-4 py-4">
          <span className="w-5 shrink-0 text-center font-mono text-sm text-ink-500">
            {i + 1}
          </span>
          <Avatar name={c.name} color={c.avatarColor} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-ink-900">{c.name}</p>
              <p className="shrink-0 font-mono text-sm text-ink-700">
                {c.voteCount} <span className="text-ink-500">votes</span>
              </p>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <ProgressBar
                value={pct(c.voteCount, totalVotesCount || 1)}
                tone={i === 0 ? "accent" : "ink"}
                size="sm"
              />
              <span className="w-10 shrink-0 text-right text-xs text-ink-500">
                {pct(c.voteCount, totalVotesCount || 1)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
