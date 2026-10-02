"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import CampaignTable from "@/components/dashboard/CampaignTable";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";
import { totalVotes, participationRate, daysRemaining } from "@/data/campaigns";
import { CAMPAIGN_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  HiOutlineUserGroup,
  HiOutlineMegaphone,
  HiOutlineHandRaised,
  HiOutlineTrophy,
  HiArrowRight,
} from "react-icons/hi2";

export default function AdminDashboardPage() {
  const { campaigns, status } = useSelector((s) => s.campaigns);
  const employees = useSelector((s) => s.organization.employees);

  const activeCampaign = campaigns.find((c) => c.status === "active");
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const completedCount = campaigns.filter((c) => c.status === "completed").length;
  const totalVoteCount = campaigns.reduce((sum, c) => sum + totalVotes(c), 0);
  const recent = [...campaigns].slice(0, 5);

  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Overview</h1>
            <p className="mt-1 text-sm text-ink-500">
              Here&apos;s how recognition is going across your organization.
            </p>
          </div>

          {status === "loading" && campaigns.length === 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Total Employees" value={employees.length || 248} icon={HiOutlineUserGroup} />
              <StatCard label="Active Campaigns" value={activeCount} icon={HiOutlineMegaphone} />
              <StatCard
                label="Total Votes"
                value={totalVoteCount.toLocaleString()}
                icon={HiOutlineHandRaised}
              />
              <StatCard label="Completed Campaigns" value={completedCount} icon={HiOutlineTrophy} />
            </div>
          )}

          {activeCampaign ? (
            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="active" dot>
                      {CAMPAIGN_STATUS_LABEL[activeCampaign.status]}
                    </Badge>
                    <span className="text-xs text-ink-500">
                      Ends {formatDate(activeCampaign.endDate)}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-ink-900">{activeCampaign.name}</h2>
                  <p className="mt-1 text-sm text-ink-500">
                    Voting ends in {daysRemaining(activeCampaign.endDate)} days
                  </p>
                </div>
                <Button as={Link} href={`/admin/campaigns/${activeCampaign.id}`} variant="secondary" size="sm">
                  View Campaign <HiArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">
                    {totalVotes(activeCampaign)}
                  </p>
                  <p className="text-xs text-ink-500">Votes received</p>
                </div>
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">
                    {activeCampaign.candidateIds.length}
                  </p>
                  <p className="text-xs text-ink-500">Candidates</p>
                </div>
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">
                    {participationRate(activeCampaign)}%
                  </p>
                  <p className="text-xs text-ink-500">Participation</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={participationRate(activeCampaign)} tone="accent" />
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <HiOutlineMegaphone className="h-8 w-8 text-ink-500" />
              <p className="text-sm font-medium text-ink-800">No active campaign right now.</p>
              <Button as={Link} href="/admin/campaigns/create" variant="accent" size="sm">
                Create Campaign
              </Button>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">Recent Campaigns</h2>
              <Link href="/admin/campaigns" className="text-xs font-medium text-ink-600 hover:text-ink-900">
                View all
              </Link>
            </div>
            <CampaignTable campaigns={recent} />
          </Card>
        </div>
      </main>
    </>
  );
}
