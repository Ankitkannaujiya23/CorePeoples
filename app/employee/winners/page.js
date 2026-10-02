"use client";

import { useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { HiOutlineTrophy } from "react-icons/hi2";

export default function PastWinnersPage() {
  const campaigns = useSelector((s) => s.campaigns.campaigns);
  const employees = useSelector((s) => s.organization.employees);

  const completed = campaigns
    .filter((c) => c.status === "completed")
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  return (
    <>
      <Topbar title="Past Winners" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Past Winners</h1>
            <p className="mt-1 text-sm text-ink-500">A hall of fame for standout months.</p>
          </div>

          {completed.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-14 text-center">
              <HiOutlineTrophy className="h-8 w-8 text-ink-500" />
              <p className="text-sm font-medium text-ink-800">No winners announced yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {completed.map((c) => {
                const winnerEntry = Object.entries(c.votes || {}).sort((a, b) => b[1] - a[1])[0];
                const winner = winnerEntry ? employees.find((e) => e.id === winnerEntry[0]) : null;
                if (!winner) return null;
                return (
                  <Card key={c.id} className="flex items-center gap-4 p-5">
                    <span className="text-2xl" aria-hidden="true">🏆</span>
                    <Avatar name={winner.name} color={winner.avatarColor} size="lg" />
                    <div>
                      <p className="text-xs text-ink-500">{formatDate(c.endDate)}</p>
                      <p className="text-[15px] font-semibold text-ink-900">{winner.name}</p>
                      <p className="text-xs text-ink-500">{winner.role}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
