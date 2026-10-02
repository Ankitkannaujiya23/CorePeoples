"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CandidateCard from "@/components/campaign/CandidateCard";
import VoteConfirmation from "@/components/campaign/VoteConfirmation";
import VoteReviewForm from "@/components/campaign/VoteReviewForm";
import { recordVote, voteRequestFailed, voteRequestStarted } from "@/store/slices/voteSlice";
import { registerVote } from "@/store/slices/campaignSlice";
import { showToast } from "@/store/slices/uiSlice";
import { voteService } from "@/services/voteService";
import { voteReviewService } from "@/services/voteReviewService";
import { HiOutlineLockClosed } from "react-icons/hi2";

// Was previously hardcoded to a fixed demo date — now uses the real
// current date, so voting windows work for any campaign, not just the
// original Aug 2026 demo data.
function getToday() {
  return new Date();
}

export default function EmployeeVotePage() {
  const { campaignId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const campaign = useSelector((s) => s.campaigns.campaigns.find((c) => c.id === campaignId));
  const employees = useSelector((s) => s.organization.employees);
  const alreadyVotedFor = useSelector(
    (s) => s.votes.userVotes[user?.employeeId]?.[campaignId]
  );

  const isPeerReview = campaign?.type === "peer_review";

  // --- Employee of the Month state ---
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [justVoted, setJustVoted] = useState(false);

  // --- Peer review state ---
  const [checkingResponse, setCheckingResponse] = useState(isPeerReview);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submittedTargetName, setSubmittedTargetName] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [justSubmittedReview, setJustSubmittedReview] = useState(false);

  useEffect(() => {
    if (!isPeerReview || !campaign) return;
    let cancelled = false;

    voteReviewService
      .getMyResponse(campaign.id)
      .then((res) => {
        if (cancelled) return;
        setAlreadySubmitted(!!res.submitted);
        if (res.submitted) {
          const target = employees.find((e) => e.id === res.targetEmployeeId);
          setSubmittedTargetName(target?.name || null);
        }
      })
      .catch(() => { })
      .finally(() => !cancelled && setCheckingResponse(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPeerReview, campaign?.id]);

  const candidates = useMemo(() => {
    if (!campaign || isPeerReview) return [];
    return campaign.candidateIds.map((id) => employees.find((e) => e.id === id)).filter(Boolean);
  }, [campaign, employees, isPeerReview]);

  if (!campaign) {
    return (
      <>
        <Topbar title="Vote" />
        <main className="flex-1 px-6 py-14 text-center text-sm text-ink-500">
          Campaign not found.
        </main>
      </>
    );
  }

  const today = getToday();
  const start = new Date(campaign.startDate + "T00:00:00");
  const end = new Date(campaign.endDate + "T23:59:59");
  const notStarted = today < start;
  const hasEnded = today > end || campaign.status === "completed";

  // ============== PEER REVIEW FLOW ==============
  if (isPeerReview) {
    async function handleReviewSubmit({ targetEmployeeId, answers }) {
      setReviewSubmitting(true);
      try {
        await voteReviewService.submitResponse(campaign.id, { targetEmployeeId, answers });
        const target = employees.find((e) => e.id === targetEmployeeId);
        setSubmittedTargetName(target?.name || null);
        setJustSubmittedReview(true);
        dispatch(showToast({ message: "Review submitted successfully!" }));
      } catch (err) {
        dispatch(showToast({ message: err.message || "Something went wrong. Try again.", type: "error" }));
      } finally {
        setReviewSubmitting(false);
      }
    }

    if (checkingResponse) {
      return (
        <>
          <Topbar title={campaign.name} />
          <main className="flex-1 px-6 py-14 text-center text-sm text-ink-500">Loading…</main>
        </>
      );
    }

    if (justSubmittedReview) {
      return (
        <>
          <Topbar title="Review Submitted" />
          <main className="flex flex-1 items-center justify-center px-4 py-14">
            <Card className="max-w-sm p-10 text-center">
              <span className="inline-block text-5xl animate-stamp" aria-hidden="true">✅</span>
              <h1 className="mt-4 text-xl font-semibold text-ink-950">Review submitted successfully!</h1>
              <p className="mt-2 text-sm text-ink-500">
                Thanks for taking the time to review {submittedTargetName?.split(" ")[0] || "your teammate"}.
              </p>
              <Button as={Link} href="/employee/dashboard" variant="accent" className="mt-6 w-full">
                Back to Dashboard
              </Button>
            </Card>
          </main>
        </>
      );
    }

    if (alreadySubmitted) {
      return (
        <>
          <Topbar title={campaign.name} />
          <main className="flex flex-1 items-center justify-center px-4 py-14">
            <Card className="max-w-sm p-10 text-center">
              <HiOutlineLockClosed className="mx-auto h-8 w-8 text-ink-500" />
              <h1 className="mt-4 text-lg font-semibold text-ink-950">
                You have already submitted this form.
              </h1>
              {submittedTargetName && (
                <p className="mt-2 text-sm text-ink-500">
                  You reviewed <span className="font-medium text-ink-800">{submittedTargetName}</span>.
                </p>
              )}
              <Button as={Link} href="/employee/dashboard" variant="secondary" className="mt-6 w-full">
                Back to Dashboard
              </Button>
            </Card>
          </main>
        </>
      );
    }

    if (notStarted || hasEnded) {
      return (
        <>
          <Topbar title={campaign.name} />
          <main className="flex flex-1 items-center justify-center px-4 py-14">
            <Card className="max-w-sm p-10 text-center">
              <h1 className="text-lg font-semibold text-ink-950">
                {notStarted ? "This form hasn't opened yet." : "This form has closed."}
              </h1>
              <Button as={Link} href="/employee/dashboard" variant="secondary" className="mt-6 w-full">
                Back to Dashboard
              </Button>
            </Card>
          </main>
        </>
      );
    }

    return (
      <>
        <Topbar title={campaign.name} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
                {campaign.name}
              </h1>
              {campaign.description && (
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">{campaign.description}</p>
              )}
            </div>

            <Card className="mt-8 p-6">
              <VoteReviewForm
                employees={employees}
                currentEmployeeId={user?.employeeId}
                questions={campaign.questions}
                onSubmit={handleReviewSubmit}
                submitting={reviewSubmitting}
              />
            </Card>
          </div>
        </main>
      </>
    );
  }

  // ============== EMPLOYEE OF THE MONTH FLOW ==============
  const hasVoted = !!alreadyVotedFor || justVoted;
  const votedCandidate = employees.find((e) => e.id === alreadyVotedFor);
  const selectedCandidate = candidates.find((c) => c.id === selectedId);

  async function handleConfirm() {
    setSubmitting(true);
    dispatch(voteRequestStarted());
    try {
      const vote = await voteService.submitVote({
        campaignId: campaign.id,
        candidateId: selectedId,
        voterId: user.employeeId,
      });
      dispatch(recordVote(vote));
      dispatch(registerVote(vote));
      setShowConfirm(false);
      setJustVoted(true);
      dispatch(showToast({ message: "Vote submitted successfully!" }));
    } catch (err) {
      dispatch(voteRequestFailed());
      dispatch(showToast({ message: err.message || "Something went wrong. Try again.", type: "error" }));
    } finally {
      setSubmitting(false);
    }
  }

  if (justVoted) {
    const votedFor = candidates.find((c) => c.id === selectedId);
    return (
      <>
        <Topbar title="Vote Submitted" />
        <main className="flex flex-1 items-center justify-center px-4 py-14">
          <Card className="max-w-sm p-10 text-center">
            <span className="inline-block text-5xl animate-stamp" aria-hidden="true">🏆</span>
            <h1 className="mt-4 text-xl font-semibold text-ink-950">Vote submitted successfully!</h1>
            <p className="mt-2 text-sm text-ink-500">
              Thanks for recognizing {votedFor?.name?.split(" ")[0] || "your teammate"}.
            </p>
            <Button as={Link} href="/employee/dashboard" variant="accent" className="mt-6 w-full">
              Back to Dashboard
            </Button>
          </Card>
        </main>
      </>
    );
  }

  if (hasVoted) {
    return (
      <>
        <Topbar title={campaign.name} />
        <main className="flex flex-1 items-center justify-center px-4 py-14">
          <Card className="max-w-sm p-10 text-center">
            <HiOutlineLockClosed className="mx-auto h-8 w-8 text-ink-500" />
            <h1 className="mt-4 text-lg font-semibold text-ink-950">
              You have already voted in this campaign.
            </h1>
            {votedCandidate && campaign.votingMode === "public" && (
              <p className="mt-2 text-sm text-ink-500">
                You voted for <span className="font-medium text-ink-800">{votedCandidate.name}</span>.
              </p>
            )}
            <Button as={Link} href="/employee/dashboard" variant="secondary" className="mt-6 w-full">
              Back to Dashboard
            </Button>
          </Card>
        </main>
      </>
    );
  }

  if (notStarted || hasEnded) {
    return (
      <>
        <Topbar title={campaign.name} />
        <main className="flex flex-1 items-center justify-center px-4 py-14">
          <Card className="max-w-sm p-10 text-center">
            <h1 className="text-lg font-semibold text-ink-950">
              {notStarted ? "Voting hasn't started yet." : "Voting has ended for this campaign."}
            </h1>
            <Button as={Link} href="/employee/dashboard" variant="secondary" className="mt-6 w-full">
              Back to Dashboard
            </Button>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Topbar title={campaign.name} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
              Who deserves Employee of the Month?
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
              Choose the teammate you believe made the biggest impact this month.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                selected={selectedId === c.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>

          <div className="sticky bottom-4 mt-8 flex justify-center">
            <Button
              variant="accent"
              size="lg"
              disabled={!selectedId}
              onClick={() => setShowConfirm(true)}
              className="shadow-pop"
            >
              Submit Vote
            </Button>
          </div>
        </div>
      </main>

      <VoteConfirmation
        open={showConfirm}
        candidate={selectedCandidate}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        submitting={submitting}
      />
    </>
  );
}