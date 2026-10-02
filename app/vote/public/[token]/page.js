"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PublicSubmissionForm from "@/components/campaign/PublicSubmissionForm";

export default function PublicVotePage() {
    const { token } = useParams();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        import("@/services/publicVoteService").then(({ publicVoteService }) => {
            publicVoteService
                .getCampaign(token)
                .then(setCampaign)
                .catch((err) => setLoadError(err.message || "This link isn't valid."))
                .finally(() => setLoading(false));
        });
    }, [token]);

    async function handleSubmit(payload) {
        setSubmitting(true);
        setSubmitError("");
        try {
            const { publicVoteService } = await import("@/services/publicVoteService");
            await publicVoteService.submit(token, payload);
            setSubmitted(true);
        } catch (err) {
            setSubmitError(err.message || "Something went wrong. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-10">
            <div className="w-full max-w-xl">
                <div className="mb-6 flex items-center justify-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold text-bronze-300">
                        V
                    </div>
                    <span className="text-[15px] font-semibold tracking-tight text-ink-900">VoteDesk</span>
                </div>

                <div className="rounded-2xl border border-line-100 bg-white p-6 shadow-subtle sm:p-8">
                    {loading && <p className="text-center text-sm text-ink-500">Loading…</p>}

                    {!loading && loadError && (
                        <div className="text-center">
                            <h1 className="text-lg font-semibold text-ink-950">{loadError}</h1>
                            <p className="mt-2 text-sm text-ink-500">
                                Check the link you were given, or ask your admin to resend it.
                            </p>
                        </div>
                    )}

                    {!loading && !loadError && campaign && submitted && (
                        <div className="text-center">
                            <span className="text-4xl" aria-hidden="true">✅</span>
                            <h1 className="mt-3 text-xl font-semibold text-ink-950">Thanks — your response is in.</h1>
                            <p className="mt-2 text-sm text-ink-500">You can close this page now.</p>
                        </div>
                    )}

                    {!loading && !loadError && campaign && !submitted && campaign.status !== "active" && (
                        <div className="text-center">
                            <h1 className="text-lg font-semibold text-ink-950">
                                {campaign.status === "draft" ? "This isn't open yet." : "This has closed."}
                            </h1>
                        </div>
                    )}

                    {!loading && !loadError && campaign && !submitted && campaign.status === "active" && (
                        <>
                            <div className="mb-6 text-center">
                                <h1 className="text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl">
                                    {campaign.name}
                                </h1>
                                {campaign.description && (
                                    <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">{campaign.description}</p>
                                )}
                            </div>

                            <PublicSubmissionForm campaign={campaign} onSubmit={handleSubmit} submitting={submitting} />
                            {submitError && (
                                <p className="mt-4 rounded-lg bg-danger-50 px-3 py-2 text-center text-sm text-danger-500">
                                    {submitError}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}