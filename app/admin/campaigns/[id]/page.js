"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Leaderboard from "@/components/campaign/Leaderboard";
import { updateCampaignStatus } from "@/store/slices/campaignSlice";
import { showToast } from "@/store/slices/uiSlice";
import { campaignService } from "@/services/campaignService";
import { CAMPAIGN_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { totalVotes, participationRate, daysRemaining } from "@/data/campaigns";
import {
  HiOutlineTrophy,
  HiOutlinePauseCircle,
  HiOutlineStopCircle,
  HiOutlineClipboard,
  HiOutlineCheck,
} from "react-icons/hi2";

const toneMap = { active: "active", draft: "draft", completed: "completed", paused: "paused" };

function PublicLinkBar({ campaign }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/vote/public/${campaign.publicToken}` : "";

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!campaign.publicToken) return null;

  return (
    <Card className="flex flex-wrap items-center gap-3 p-4">
      <span className="text-sm font-medium text-ink-800">Public link:</span>
      <span className="min-w-0 flex-1 truncate text-sm text-ink-600">{url}</span>
      <button
        onClick={copyLink}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-800"
      >
        {copied ? <HiOutlineCheck className="h-4 w-4" /> : <HiOutlineClipboard className="h-4 w-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </Card>
  );
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const campaign = useSelector((s) => s.campaigns.campaigns.find((c) => c.id === id));
  const employees = useSelector((s) => s.organization.employees);
  const [confirmEnd, setConfirmEnd] = useState(false);

  if (!campaign) {
    return (
      <>
        <Topbar title="Campaign" />
        <main className="flex-1 px-6 py-14 text-center text-sm text-ink-500">
          Campaign not found.
        </main>
      </>
    );
  }

  const isPeerReview = campaign.type === "peer_review";
  const isPublicLink = campaign.accessMode === "public_link";

  const candidates = campaign.candidateIds
    .map((id) => employees.find((e) => e.id === id))
    .filter(Boolean);
  const votes = totalVotes(campaign);
  const rate = participationRate(campaign);
  const daysLeft = daysRemaining(campaign.endDate);

  async function togglePause() {
    const next = campaign.status === "paused" ? "active" : "paused";
    try {
      await campaignService.updateCampaignStatus(campaign.id, next);
      dispatch(updateCampaignStatus({ campaignId: campaign.id, status: next }));
      dispatch(showToast({ message: next === "paused" ? "Paused." : "Resumed." }));
    } catch (err) {
      dispatch(showToast({ message: err.message || "Unable to update campaign.", type: "error" }));
    }
  }

  async function endCampaign() {
    try {
      await campaignService.updateCampaignStatus(campaign.id, "completed");
      dispatch(updateCampaignStatus({ campaignId: campaign.id, status: "completed" }));
      dispatch(showToast({ message: "Campaign ended. Results are now final." }));
      setConfirmEnd(false);
    } catch (err) {
      dispatch(showToast({ message: err.message || "Unable to end campaign.", type: "error" }));
    }
  }

  return (
    <>
      <Topbar title="Campaign Details" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={toneMap[campaign.status]} dot>
                    {CAMPAIGN_STATUS_LABEL[campaign.status]}
                  </Badge>
                  {isPeerReview && <Badge tone="accent">Peer Review Form</Badge>}
                  {isPublicLink && <Badge tone="accent">Public Link</Badge>}
                </div>
                <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink-950">
                  {campaign.name}
                </h1>
                <p className="mt-1 text-sm text-ink-500">
                  {formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}
                  {campaign.status === "active" && daysLeft >= 0 && ` · Closes in ${daysLeft} days`}
                </p>
              </div>
              <div className="flex gap-2">
                {campaign.status !== "completed" && campaign.status !== "draft" && (
                  <Button variant="secondary" size="sm" onClick={togglePause}>
                    <HiOutlinePauseCircle className="h-4 w-4" />
                    {campaign.status === "paused" ? "Resume" : "Pause"}
                  </Button>
                )}
                {campaign.status !== "completed" && campaign.status !== "draft" && (
                  <Button variant="secondary" size="sm" onClick={() => setConfirmEnd(true)}>
                    <HiOutlineStopCircle className="h-4 w-4" /> End Campaign
                  </Button>
                )}
                <Button as={Link} href={`/admin/campaigns/${campaign.id}/results`} variant="accent" size="sm">
                  <HiOutlineTrophy className="h-4 w-4" /> View Results
                </Button>
              </div>
            </div>

            {campaign.description && (
              <p className="mt-4 text-sm text-ink-600">{campaign.description}</p>
            )}

            {isPeerReview ? (
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">{campaign.questions.length}</p>
                  <p className="text-xs text-ink-500">Questions</p>
                </div>
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">{campaign.totalEligibleVoters}</p>
                  <p className="text-xs text-ink-500">Eligible reviewers</p>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">{votes}</p>
                  <p className="text-xs text-ink-500">Votes</p>
                </div>
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">{rate}%</p>
                  <p className="text-xs text-ink-500">Participation</p>
                </div>
                <div className="rounded-xl bg-surface-50 p-4 text-center">
                  <p className="font-mono text-xl font-semibold text-ink-900">{candidates.length}</p>
                  <p className="text-xs text-ink-500">Candidates</p>
                </div>
              </div>
            )}
          </Card>

          {isPublicLink && <PublicLinkBar campaign={campaign} />}

          {isPeerReview ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-ink-600">
                This is an open form — everyone can review one teammate of their choice.
              </p>
              <Button as={Link} href={`/admin/campaigns/${campaign.id}/results`} variant="secondary" size="sm" className="mt-4">
                View per-employee summary &amp; responses
              </Button>
            </Card>
          ) : isPublicLink ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-ink-600">
                Votes submitted through the public link show up on the results page.
              </p>
              <Button as={Link} href={`/admin/campaigns/${campaign.id}/results`} variant="secondary" size="sm" className="mt-4">
                View votes
              </Button>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-ink-900">Candidate Leaderboard</h2>
              <div className="mt-2">
                <Leaderboard candidates={candidates} votes={campaign.votes} totalVotesCount={votes} />
              </div>
            </Card>
          )}
        </div>
      </main>

      <Modal
        open={confirmEnd}
        onClose={() => setConfirmEnd(false)}
        title="End this campaign?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmEnd(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={endCampaign}>
              End Campaign
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          This closes it immediately and makes it read-only. This can&apos;t be undone.
        </p>
      </Modal>
    </>
  );
}