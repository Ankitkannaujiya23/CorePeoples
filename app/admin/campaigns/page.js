"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import CampaignCard from "@/components/dashboard/CampaignCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import { deleteCampaign, duplicateCampaign } from "@/store/slices/campaignSlice";
import { showToast } from "@/store/slices/uiSlice";
import { campaignService } from "@/services/campaignService";
import { cn } from "@/lib/utils";
import { HiOutlineMegaphone, HiOutlinePlus } from "react-icons/hi2";

const filters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "completed", label: "Completed" },
];

export default function AdminCampaignsPage() {
  const dispatch = useDispatch();
  const { campaigns, status } = useSelector((s) => s.campaigns);
  const [filter, setFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = campaigns.filter((c) => filter === "all" || c.status === filter);

  async function confirmDelete() {
    try {
      await campaignService.deleteCampaign(pendingDelete.id);
      dispatch(deleteCampaign(pendingDelete.id));
      dispatch(showToast({ message: `"${pendingDelete.name}" was deleted.`, type: "info" }));
      setPendingDelete(null);
    } catch (err) {
      dispatch(showToast({ message: err.message || "Unable to delete campaign.", type: "error" }));
    }
  }

  function handleDuplicate(campaign) {
    dispatch(duplicateCampaign(campaign.id));
    dispatch(showToast({ message: `Duplicated "${campaign.name}" as a draft.` }));
  }

  return (
    <>
      <Topbar title="Campaigns" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Campaigns</h1>
              <p className="mt-1 text-sm text-ink-500">Manage every recognition cycle in one place.</p>
            </div>
            <Button as={Link} href="/admin/campaigns/create" variant="accent" size="sm">
              <HiOutlinePlus className="h-4 w-4" /> Create Campaign
            </Button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                  filter === f.value
                    ? "bg-ink-900 text-white"
                    : "bg-white text-ink-600 border border-line-200 hover:bg-surface-100"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {status === "loading" && campaigns.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
              <HiOutlineMegaphone className="h-8 w-8 text-ink-500" />
              <p className="text-sm font-medium text-ink-800">No campaigns yet.</p>
              <p className="max-w-xs text-sm text-ink-500">
                Create your first Employee of the Month campaign.
              </p>
              <Button as={Link} href="/admin/campaigns/create" variant="accent" size="sm">
                Create Campaign
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onEdit={() => dispatch(showToast({ message: "Editing is coming soon.", type: "info" }))}
                  onDuplicate={() => handleDuplicate(c)}
                  onDelete={() => setPendingDelete(c)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete campaign"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          Delete <span className="font-medium text-ink-900">&ldquo;{pendingDelete?.name}&rdquo;</span>?
          This can&apos;t be undone.
        </p>
      </Modal>
    </>
  );
}
