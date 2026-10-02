"use client";

import { useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

export default function MyVotesPage() {
  const user = useSelector((s) => s.auth.user);
  const campaigns = useSelector((s) => s.campaigns.campaigns);
  const myVotes = useSelector((s) => s.votes.userVotes[user?.employeeId] || {});

  const votedCampaigns = campaigns.filter((c) => myVotes[c.id]);

  return (
    <>
      <Topbar title="My Votes" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-950">My Voting Activity</h1>
            <p className="mt-1 text-sm text-ink-500">Every campaign you&apos;ve taken part in.</p>
          </div>

          {votedCampaigns.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-14 text-center">
              <HiOutlineClipboardDocumentList className="h-8 w-8 text-ink-500" />
              <p className="text-sm font-medium text-ink-800">You haven&apos;t voted yet.</p>
              <p className="text-sm text-ink-500">Your voting history will show up here.</p>
            </Card>
          ) : (
            <Card className="divide-y divide-line-100">
              {votedCampaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-500">{formatDate(c.endDate)}</p>
                  </div>
                  <Badge tone="active" dot>
                    Voted
                  </Badge>
                </div>
              ))}
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
