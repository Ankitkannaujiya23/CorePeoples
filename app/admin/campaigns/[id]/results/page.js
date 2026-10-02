"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Leaderboard from "@/components/campaign/Leaderboard";
import { voteReviewService } from "@/services/voteReviewService";
import { campaignService } from "@/services/campaignService";
import { CAMPAIGN_STATUS_LABEL } from "@/lib/constants";
import { formatDate, pct } from "@/lib/utils";
import { totalVotes } from "@/data/campaigns";
import { HiStar } from "react-icons/hi2";

function QuestionSummaryLine({ q }) {
  if (q.type === "rating") {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-600">{q.label}</span>
        <span className="flex items-center gap-1 font-medium text-ink-900">
          <HiStar className="h-4 w-4 text-bronze-500" />
          {q.average !== null ? q.average : "—"}
        </span>
      </div>
    );
  }
  if (q.type === "yesno") {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-600">{q.label}</span>
        <span className="font-medium text-ink-900">
          {q.yesPercentage !== null ? `${q.yesPercentage}% Yes` : "—"}
        </span>
      </div>
    );
  }
  return (
    <div className="text-sm">
      <p className="text-ink-600">{q.label}</p>
      {q.comments.length === 0 ? (
        <p className="mt-1 text-xs text-ink-400">No comments yet.</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {q.comments.map((c, i) => (
            <li key={i} className="rounded-lg bg-surface-50 px-3 py-2 text-xs text-ink-700">
              &ldquo;{c}&rdquo;
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PeerReviewResults({ campaign }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    voteReviewService
      .getResponses(campaign.id)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message || "Couldn't load responses."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [campaign.id]);

  if (loading) return <p className="text-center text-sm text-ink-500">Loading responses…</p>;
  if (error) return <p className="text-center text-sm text-danger-500">{error}</p>;
  if (!data) return null;

  return (
    <>
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-ink-900">Summary by employee</h2>
        {data.summary.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">No responses yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {data.summary.map((entry) => (
              <div key={entry.employeeId} className="rounded-xl border border-line-100 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={entry.employeeName} color={entry.avatarColor} size="md" />
                  <div>
                    <p className="text-sm font-medium text-ink-900">{entry.employeeName}</p>
                    <p className="text-xs text-ink-500">
                      {entry.responseCount} response{entry.responseCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2 border-t border-line-100 pt-3">
                  {entry.questions.map((q) => (
                    <QuestionSummaryLine key={q.questionId} q={q} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-ink-900">Individual responses</h2>
        {data.responses.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">No responses yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {data.responses.map((r) => (
              <div key={r.id} className="rounded-xl border border-line-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-900">
                    {r.voterName} → {r.targetName}
                  </p>
                  <p className="text-xs text-ink-500">{formatDate(r.submittedAt?.slice?.(0, 10) || r.submittedAt)}</p>
                </div>
                <div className="mt-2 space-y-1.5">
                  {r.answers.map((a) => (
                    <p key={a.questionId} className="text-xs text-ink-600">
                      <span className="font-medium text-ink-800">{a.label}:</span>{" "}
                      {a.type === "rating" ? `${a.value} / 5` : a.type === "yesno" ? a.value : `"${a.value}"`}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

function PublicLinkResults({ campaign }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    campaignService
      .getPublicSubmissions(campaign.id)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message || "Couldn't load submissions."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [campaign.id]);

  if (loading) return <p className="text-center text-sm text-ink-500">Loading submissions…</p>;
  if (error) return <p className="text-center text-sm text-danger-500">{error}</p>;
  if (!data) return null;

  if (data.type === "employee_of_the_month") {
    const total = data.tally.reduce((sum, t) => sum + t.count, 0);
    return (
      <>
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-ink-900">Tally</h2>
          {data.tally.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">No votes yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {data.tally.map((t) => (
                <div key={t.targetEmployeeId || t.targetName}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-900">{t.targetName}</span>
                    <span className="font-mono text-ink-700">{t.count} votes</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar value={pct(t.count, total || 1)} tone="accent" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-ink-900">Individual submissions</h2>
          {data.submissions.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">No submissions yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-line-100">
              {data.submissions.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-ink-700">
                    {s.voterName} <span className="text-ink-400">({s.voterEmployeeId})</span> voted for{" "}
                    <span className="font-medium text-ink-900">{s.targetName}</span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-500">
                    {formatDate(s.submittedAt?.slice?.(0, 10) || s.submittedAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-ink-900">Summary by person reviewed</h2>
        {data.summary.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">No responses yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {data.summary.map((entry) => (
              <div key={entry.targetName} className="rounded-xl border border-line-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-900">{entry.targetName}</p>
                  <p className="text-xs text-ink-500">
                    {entry.responseCount} response{entry.responseCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="mt-3 space-y-2 border-t border-line-100 pt-3">
                  {entry.questions.map((q) => (
                    <QuestionSummaryLine key={q.questionId} q={q} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-ink-400">
          Grouped by the name typed in — slightly different spellings of the same name
          will show up as separate entries.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-ink-900">Individual responses</h2>
        {data.submissions.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">No responses yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {data.submissions.map((r) => (
              <div key={r.id} className="rounded-xl border border-line-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-900">
                    {r.voterName} <span className="text-ink-400">({r.voterEmployeeId})</span> → {r.targetName}
                  </p>
                  <p className="text-xs text-ink-500">{formatDate(r.submittedAt?.slice?.(0, 10) || r.submittedAt)}</p>
                </div>
                <div className="mt-2 space-y-1.5">
                  {r.answers.map((a) => (
                    <p key={a.questionId} className="text-xs text-ink-600">
                      <span className="font-medium text-ink-800">{a.label}:</span>{" "}
                      {a.type === "rating" ? `${a.value} / 5` : a.type === "yesno" ? a.value : `"${a.value}"`}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

export default function CampaignResultsPage() {
  const { id } = useParams();
  const campaign = useSelector((s) => s.campaigns.campaigns.find((c) => c.id === id));
  const employees = useSelector((s) => s.organization.employees);

  if (!campaign) {
    return (
      <>
        <Topbar title="Results" />
        <main className="flex-1 px-6 py-14 text-center text-sm text-ink-500">
          Campaign not found.
        </main>
      </>
    );
  }

  const isPeerReview = campaign.type === "peer_review";
  const isPublicLink = campaign.accessMode === "public_link";

  if (isPublicLink || isPeerReview) {
    return (
      <>
        <Topbar title="Results" />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <Badge tone={campaign.status === "completed" ? "completed" : "active"} dot className="mx-auto">
                {CAMPAIGN_STATUS_LABEL[campaign.status]}
              </Badge>
              <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink-950">{campaign.name}</h1>
              <p className="mt-1 text-sm text-ink-500">
                {formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}
              </p>
            </div>

            {isPublicLink ? <PublicLinkResults campaign={campaign} /> : <PeerReviewResults campaign={campaign} />}
          </div>
        </main>
      </>
    );
  }

  const candidates = campaign.candidateIds
    .map((id) => employees.find((e) => e.id === id))
    .filter(Boolean);
  const votes = totalVotes(campaign);
  const winnerEntry = Object.entries(campaign.votes || {}).sort((a, b) => b[1] - a[1])[0];
  const winner = winnerEntry ? employees.find((e) => e.id === winnerEntry[0]) : null;
  const winnerVotes = winnerEntry ? winnerEntry[1] : 0;

  return (
    <>
      <Topbar title="Results" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center">
            <Badge tone={campaign.status === "completed" ? "completed" : "active"} dot className="mx-auto">
              {CAMPAIGN_STATUS_LABEL[campaign.status]}
            </Badge>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink-950">{campaign.name}</h1>
            <p className="mt-1 text-sm text-ink-500">
              {formatDate(campaign.startDate)} – {formatDate(campaign.endDate)} · {votes} total votes
            </p>
          </div>

          {winner && (
            <Card className="flex flex-col items-center gap-3 p-10 text-center animate-scale-in bg-gradient-to-b from-bronze-50/60 to-white">
              <span className="text-4xl" aria-hidden="true">🏆</span>
              <Avatar name={winner.name} color={winner.avatarColor} size="xl" />
              <div>
                <p className="text-xl font-semibold tracking-tight text-ink-950">{winner.name}</p>
                <p className="text-sm text-ink-500">{winner.role}</p>
              </div>
              <p className="font-mono text-lg font-semibold text-bronze-600">{winnerVotes} Votes</p>
              <p className="text-sm text-ink-600">Employee of the Month</p>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-ink-900">Full Leaderboard</h2>
            <div className="mt-2">
              <Leaderboard candidates={candidates} votes={campaign.votes} totalVotesCount={votes} />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}