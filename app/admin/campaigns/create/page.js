"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CampaignForm from "@/components/campaign/CampaignForm";
import {
  addCampaign,
  campaignsRequestFailed,
  campaignsRequestStarted,
} from "@/store/slices/campaignSlice";
import { showToast } from "@/store/slices/uiSlice";
import { campaignService } from "@/services/campaignService";
import { HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi2";

function PublicLinkSuccess({ campaign }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/vote/public/${campaign.publicToken}` : "";

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card className="p-8 text-center">
      <span className="text-4xl" aria-hidden="true">🔗</span>
      <h1 className="mt-3 text-xl font-semibold tracking-tight text-ink-950">
        Your campaign is live.
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
        Share this link with everyone who should respond — no account needed.
      </p>

      <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl border border-line-200 bg-surface-50 px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate text-left text-sm text-ink-700">{url}</span>
        <button
          onClick={copyLink}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-800"
        >
          {copied ? <HiOutlineCheck className="h-4 w-4" /> : <HiOutlineClipboard className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <Button as={Link} href={`/admin/campaigns/${campaign.id}`} variant="accent" className="mt-7">
        Continue to Campaign
      </Button>
    </Card>
  );
}

export default function CreateCampaignPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);

  async function handleSubmit(payload) {
    setSubmitting(true);
    dispatch(campaignsRequestStarted());
    try {
      const campaign = await campaignService.createCampaign(payload);
      dispatch(addCampaign(campaign));

      if (campaign.accessMode === "public_link" && campaign.publicToken) {
        setCreatedCampaign(campaign);
      } else {
        dispatch(
          showToast({
            message: payload.saveAsDraft
              ? "Campaign saved as draft."
              : "Campaign created and published.",
          })
        );
        router.push(`/admin/campaigns/${campaign.id}`);
      }
    } catch (err) {
      dispatch(campaignsRequestFailed(err.message));
      dispatch(showToast({ message: err.message || "Unable to create campaign.", type: "error" }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Topbar title="Create Campaign" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {createdCampaign ? (
            <PublicLinkSuccess campaign={createdCampaign} />
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
                Create a campaign
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Set up your next recognition campaign.
              </p>

              <Card className="mt-6 p-6 sm:p-8">
                <CampaignForm onSubmit={handleSubmit} submitting={submitting} />
              </Card>
            </>
          )}
        </div>
      </main>
    </>
  );
}