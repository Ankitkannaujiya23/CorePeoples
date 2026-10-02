"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { HiOutlineMegaphone, HiArrowRight } from "react-icons/hi2";

export default function EmployeeDashboardPage() {
  const user = useSelector((s) => s.auth.user);
  const campaigns = useSelector((s) => s.campaigns.campaigns);
  const userVotes = useSelector((s) => s.votes.userVotes[user?.employeeId] || {});

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const pending = activeCampaigns.filter((c) => !userVotes[c.id]);
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      <Topbar title="Home" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
              Good morning, {firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {pending.length > 0
                ? `You have ${pending.length} active campaign${pending.length > 1 ? "s" : ""} waiting for your vote.`
                : "You're all caught up — no campaigns waiting for your vote."}
            </p>
          </div>

          {activeCampaigns.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-14 text-center">
              <HiOutlineMegaphone className="h-8 w-8 text-ink-500" />
              <p className="text-sm font-medium text-ink-800">No active campaigns right now.</p>
              <p className="text-sm text-ink-500">Check back soon for the next recognition cycle.</p>
            </Card>
          ) : (
            activeCampaigns.map((c) => {
              const voted = !!userVotes[c.id];
              return (
                <Card key={c.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-2xl" aria-hidden="true">🏆</span>
                      <h2 className="mt-2 text-lg font-semibold text-ink-900">{c.name}</h2>
                      <p className="mt-1 text-sm text-ink-500">Voting ends: {formatDate(c.endDate)}</p>
                      <p className="mt-1 text-sm text-ink-500">{c.candidateIds.length} candidates</p>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    href={`/employee/vote/${c.id}`}
                    variant={voted ? "secondary" : "accent"}
                    className="mt-5 w-full sm:w-auto"
                  >
                    {voted ? "View Your Vote" : "Cast Your Vote"} <HiArrowRight className="h-4 w-4" />
                  </Button>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
