"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Dropdown from "@/components/ui/Dropdown";
import { CAMPAIGN_STATUS_LABEL } from "@/lib/constants";
import { formatShortDate } from "@/lib/utils";
import { totalVotes, participationRate } from "@/data/campaigns";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";

const toneMap = { active: "active", draft: "draft", completed: "completed", paused: "paused" };

export default function CampaignCard({ campaign, onEdit, onDuplicate, onDelete }) {
  const votes = totalVotes(campaign);
  const rate = participationRate(campaign);

  return (
    <Card hoverable className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <Badge tone={toneMap[campaign.status]} dot>
          {CAMPAIGN_STATUS_LABEL[campaign.status]}
        </Badge>
        <Dropdown
          trigger={
            <span className="rounded-lg p-1 text-ink-500 hover:bg-surface-100 hover:text-ink-900">
              <HiOutlineEllipsisHorizontal className="h-5 w-5" />
            </span>
          }
          items={[
            { label: "View", onClick: () => (window.location.href = `/admin/campaigns/${campaign.id}`) },
            { label: "Edit", onClick: onEdit },
            { label: "Duplicate", onClick: onDuplicate },
            { divider: true },
            { label: "Delete", onClick: onDelete, danger: true },
          ]}
        />
      </div>

      <Link href={`/admin/campaigns/${campaign.id}`} className="mt-3 block">
        <h3 className="text-[15px] font-semibold text-ink-900 leading-snug hover:text-bronze-600 transition-colors">
          {campaign.name}
        </h3>
      </Link>

      <p className="mt-1 text-xs text-ink-500">
        {formatShortDate(campaign.startDate)} – {formatShortDate(campaign.endDate)}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
        <span>{campaign.candidateIds.length} candidates</span>
        <span className="font-mono">{votes} votes</span>
      </div>
      <div className="mt-2">
        <ProgressBar value={rate} tone="accent" size="sm" />
      </div>
      <p className="mt-1.5 text-xs text-ink-500">{rate}% participation</p>
    </Card>
  );
}
