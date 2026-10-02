"use client";

import { useState } from "react";
import Input, { Field } from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { HiStar } from "react-icons/hi2";

const RATING_VALUES = [1, 2, 3, 4, 5];

function RatingInput({ value, onChange }) {
    return (
        <div className="flex gap-1">
            {RATING_VALUES.map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(String(n))}
                    className="rounded-lg p-1 focus-ring"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                    <HiStar
                        className={cn(
                            "h-7 w-7 transition-colors",
                            Number(value) >= n ? "text-bronze-500" : "text-line-200"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}

function YesNoInput({ value, onChange }) {
    return (
        <div className="flex gap-2">
            {["yes", "no"].map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={cn(
                        "rounded-xl border px-4 py-2 text-sm font-medium capitalize transition-colors",
                        value === opt
                            ? "border-bronze-500 bg-bronze-500 text-white"
                            : "border-line-200 text-ink-700 hover:bg-surface-50"
                    )}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}

export default function PublicSubmissionForm({ campaign, onSubmit, submitting }) {
    const isEOTM = campaign.type === "employee_of_the_month";

    const [employeeId, setEmployeeId] = useState("");
    const [voterName, setVoterName] = useState("");
    const [targetCandidateId, setTargetCandidateId] = useState(null);
    const [targetName, setTargetName] = useState("");
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");

    function updateAnswer(questionId, value) {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!employeeId.trim() || !voterName.trim()) {
            setError("Enter your employee ID and name.");
            return;
        }
        if (isEOTM && !targetCandidateId) {
            setError("Choose who you're voting for.");
            return;
        }
        if (!isEOTM) {
            if (!targetName.trim()) {
                setError("Enter the name of the person you're reviewing.");
                return;
            }
            const missing = campaign.questions.some((q) => !answers[q.id]);
            if (missing) {
                setError("Please answer every question.");
                return;
            }
        }

        setError("");
        onSubmit({
            employeeId: employeeId.trim(),
            voterName: voterName.trim(),
            ...(isEOTM
                ? { targetCandidateId }
                : {
                    targetName: targetName.trim(),
                    answers: campaign.questions.map((q) => ({ questionId: q.id, value: answers[q.id] })),
                }),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Your Employee ID" htmlFor="employeeId" required>
                    <Input
                        id="employeeId"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="e.g. I3534"
                    />
                </Field>
                <Field label="Your Name" htmlFor="voterName" required>
                    <Input
                        id="voterName"
                        value={voterName}
                        onChange={(e) => setVoterName(e.target.value)}
                        placeholder="Your full name"
                    />
                </Field>
            </div>

            {isEOTM ? (
                <div>
                    <p className="text-sm font-medium text-ink-800">Who deserves this?</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {campaign.candidates.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setTargetCandidateId(c.id)}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                                    targetCandidateId === c.id
                                        ? "border-bronze-500 bg-bronze-50/50"
                                        : "border-line-200 hover:bg-surface-50"
                                )}
                            >
                                <Avatar name={c.name} color={c.avatarColor} size="sm" />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-ink-900">{c.name}</p>
                                    <p className="truncate text-xs text-ink-500">{c.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <Field label="Who are you reviewing?" htmlFor="targetName" required>
                        <Input
                            id="targetName"
                            value={targetName}
                            onChange={(e) => setTargetName(e.target.value)}
                            placeholder="Their full name"
                        />
                    </Field>

                    <div className="space-y-5">
                        {campaign.questions.map((q) => (
                            <div key={q.id} className="rounded-xl border border-line-100 bg-white p-4">
                                <p className="text-sm font-medium text-ink-900">{q.label}</p>
                                <div className="mt-3">
                                    {q.type === "rating" && (
                                        <RatingInput value={answers[q.id]} onChange={(v) => updateAnswer(q.id, v)} />
                                    )}
                                    {q.type === "yesno" && (
                                        <YesNoInput value={answers[q.id]} onChange={(v) => updateAnswer(q.id, v)} />
                                    )}
                                    {q.type === "text" && (
                                        <textarea
                                            value={answers[q.id] || ""}
                                            onChange={(e) => updateAnswer(q.id, e.target.value)}
                                            rows={3}
                                            placeholder="Share your thoughts…"
                                            className="w-full rounded-xl border border-line-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/70 focus-ring focus:border-ink-700"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-500">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-bronze-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-bronze-600 disabled:bg-bronze-300"
            >
                {submitting ? "Submitting…" : "Submit"}
            </button>
        </form>
    );
}