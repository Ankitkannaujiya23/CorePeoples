"use client";

import { useState } from "react";
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

export default function VoteReviewForm({ employees, currentEmployeeId, questions, onSubmit, submitting }) {
    const [targetId, setTargetId] = useState("");
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");

    const reviewable = employees.filter((e) => e.id !== currentEmployeeId);

    function updateAnswer(questionId, value) {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!targetId) {
            setError("Choose a teammate to review.");
            return;
        }
        const missing = questions.some((q) => !answers[q.id]);
        if (missing) {
            setError("Please answer every question.");
            return;
        }
        setError("");
        onSubmit({
            targetEmployeeId: targetId,
            answers: questions.map((q) => ({ questionId: q.id, value: answers[q.id] })),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="target" className="text-sm font-medium text-ink-800">
                    Who are you reviewing?
                </label>
                <select
                    id="target"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-line-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus-ring focus:border-ink-700"
                >
                    <option value="">Select a teammate…</option>
                    {reviewable.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.name} — {emp.role}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-5">
                {questions.map((q) => (
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

            {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-500">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-bronze-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-bronze-600 disabled:bg-bronze-300"
            >
                {submitting ? "Submitting…" : "Submit Review"}
            </button>
        </form>
    );
}