import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { CAMPAIGN_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { totalVotes } from "@/data/campaigns";

const toneMap = { active: "active", draft: "draft", completed: "completed", paused: "paused" };

export default function CampaignTable({ campaigns }) {
  if (!campaigns.length) {
    return (
      <div className="px-5 py-10 text-center text-sm text-ink-500">
        No campaigns to show yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-line-100 text-xs uppercase tracking-wide text-ink-500">
            <th className="px-5 py-3 font-medium">Campaign</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Votes</th>
            <th className="px-5 py-3 font-medium">End Date</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-b border-line-100 last:border-0 hover:bg-surface-50 transition-colors">
              <td className="px-5 py-3.5">
                <Link href={`/admin/campaigns/${c.id}`} className="font-medium text-ink-900 hover:text-bronze-600">
                  {c.name}
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <Badge tone={toneMap[c.status]} dot>
                  {CAMPAIGN_STATUS_LABEL[c.status]}
                </Badge>
              </td>
              <td className="px-5 py-3.5 font-mono text-ink-700">{totalVotes(c)}</td>
              <td className="px-5 py-3.5 text-ink-600">{formatDate(c.endDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
