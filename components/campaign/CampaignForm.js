"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Input, { Field } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { HiOutlineInformationCircle, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { cn } from "@/lib/utils";

const QUESTION_TYPE_LABELS = {
  rating: "Rating (1–5)",
  yesno: "Yes / No",
  text: "Free text comment",
};

export default function CampaignForm({ onSubmit, submitting }) {
  const employees = useSelector((s) => s.organization.employees);

  const [campaignType, setCampaignType] = useState("employee_of_the_month");
  const [accessMode, setAccessMode] = useState("authenticated");
  const [name, setName] = useState("Employee of the Month — September 2026");
  const [description, setDescription] = useState("");
  const [candidateIds, setCandidateIds] = useState([]);
  const [questions, setQuestions] = useState([
    { label: "How would you rate their performance?", type: "rating" },
    { label: "Are they consistently on time?", type: "yesno" },
  ]);
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-30");
  const [votingMode, setVotingMode] = useState("public");
  const [resultVisibility, setResultVisibility] = useState("after_voting_ends");
  const [errors, setErrors] = useState({});

  const isPeerReview = campaignType === "peer_review";
  const isPublicLink = accessMode === "public_link";

  function toggleCandidate(id) {
    setCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, { label: "", type: "rating" }]);
  }

  function updateQuestion(index, field, value) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  }

  function removeQuestion(index) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Campaign name is required.";
    if (!startDate) next.startDate = "Start date is required.";
    if (!endDate) next.endDate = "End date is required.";
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      next.endDate = "End date must be after the start date.";
    }

    if (isPeerReview) {
      if (questions.length === 0) {
        next.questions = "Add at least one question.";
      } else if (questions.some((q) => !q.label.trim())) {
        next.questions = "Every question needs a label.";
      }
    } else if (candidateIds.length === 0) {
      next.candidates = "Select at least one candidate.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e, saveAsDraft) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name,
      description,
      type: campaignType,
      accessMode,
      startDate,
      endDate,
      votingMode,
      resultVisibility,
      saveAsDraft,
    };

    if (isPeerReview) {
      payload.questions = questions.map((q) => ({ label: q.label.trim(), type: q.type }));
    } else {
      payload.candidateIds = candidateIds;
    }

    onSubmit(payload);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
      <section className="space-y-5">
        <h2 className="text-sm font-semibold text-ink-900">Campaign details</h2>
        <Field label="Campaign name" htmlFor="name" required error={errors.name}>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Employee of the Month — September 2026"
          />
        </Field>
        <Field label="Description" htmlFor="description" hint="Optional">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What should this campaign recognize?"
            className="w-full rounded-xl border border-line-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/70 focus-ring focus:border-ink-700"
          />
        </Field>

        <Field label="Campaign type">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              {
                value: "employee_of_the_month",
                label: "Employee of the Month",
                hint: "Pick a shortlist of candidates — everyone votes for one.",
              },
              {
                value: "peer_review",
                label: "Peer review form",
                hint: "One open form — each person reviews a teammate of their choice.",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3 transition-colors",
                  campaignType === opt.value ? "border-bronze-500 bg-bronze-50/50" : "border-line-200 hover:bg-surface-50"
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink-900">
                  <input
                    type="radio"
                    name="campaignType"
                    checked={campaignType === opt.value}
                    onChange={() => setCampaignType(opt.value)}
                    className="h-4 w-4 text-bronze-500 focus-ring"
                  />
                  {opt.label}
                </span>
                <span className="text-xs text-ink-500">{opt.hint}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Who can respond">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              {
                value: "authenticated",
                label: "Employees log in",
                hint: "Only people with a VoteDesk account can respond.",
              },
              {
                value: "public_link",
                label: "Public link — no login",
                hint: "Anyone with the link can respond by typing their employee ID and name.",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3 transition-colors",
                  accessMode === opt.value ? "border-bronze-500 bg-bronze-50/50" : "border-line-200 hover:bg-surface-50"
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink-900">
                  <input
                    type="radio"
                    name="accessMode"
                    checked={accessMode === opt.value}
                    onChange={() => setAccessMode(opt.value)}
                    className="h-4 w-4 text-bronze-500 focus-ring"
                  />
                  {opt.label}
                </span>
                <span className="text-xs text-ink-500">{opt.hint}</span>
              </label>
            ))}
          </div>
          {isPublicLink && (
            <p className="mt-2 flex items-start gap-2 rounded-lg bg-bronze-50/60 px-3 py-2 text-xs text-ink-600">
              <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0 text-bronze-600" />
              A shareable link is generated once you create this campaign. Duplicate
              submissions are blocked by the employee ID each person types in — it
              isn&apos;t checked against your employee list.
            </p>
          )}
        </Field>
      </section>

      {isPeerReview ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Questions</h2>
            <span className="text-xs text-ink-500">{questions.length} questions</span>
          </div>
          {errors.questions && <p className="text-xs text-danger-500">{errors.questions}</p>}

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={index} className="flex items-start gap-2 rounded-xl border border-line-200 p-3">
                <div className="flex-1 space-y-2">
                  <Input
                    value={q.label}
                    onChange={(e) => updateQuestion(index, "label", e.target.value)}
                    placeholder="e.g. How would you rate their quality of work?"
                  />
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(index, "type", e.target.value)}
                    className="w-full rounded-xl border border-line-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus-ring focus:border-ink-700"
                  >
                    {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="mt-1 rounded-lg p-2 text-ink-500 hover:bg-danger-50 hover:text-danger-500 focus-ring"
                  aria-label="Remove question"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <Button type="button" variant="secondary" size="sm" onClick={addQuestion}>
            <HiOutlinePlus className="h-4 w-4" /> Add Question
          </Button>
        </section>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Candidates</h2>
            <span className="text-xs text-ink-500">{candidateIds.length} selected</span>
          </div>
          {errors.candidates && <p className="text-xs text-danger-500">{errors.candidates}</p>}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {employees.map((emp) => {
              const checked = candidateIds.includes(emp.id);
              return (
                <label
                  key={emp.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors",
                    checked ? "border-bronze-500 bg-bronze-50/50" : "border-line-200 hover:bg-surface-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCandidate(emp.id)}
                    className="h-4 w-4 rounded border-line-200 text-bronze-500 focus-ring"
                  />
                  <Avatar name={emp.name} color={emp.avatarColor} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{emp.name}</p>
                    <p className="truncate text-xs text-ink-500">{emp.role}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-5">
        <h2 className="text-sm font-semibold text-ink-900">
          {isPeerReview ? "Response period" : "Voting period"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Start date" htmlFor="startDate" required error={errors.startDate}>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={errors.startDate}
            />
          </Field>
          <Field label="End date" htmlFor="endDate" required error={errors.endDate}>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={errors.endDate}
            />
          </Field>
        </div>
      </section>

      {!isPublicLink && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-ink-900">
            {isPeerReview ? "Response visibility" : "Voting mode"}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              {
                value: "public",
                label: isPeerReview ? "Named responses" : "Public voting",
                hint: isPeerReview
                  ? "Admin sees who submitted each response."
                  : "Votes are visible to admins by name.",
              },
              {
                value: "anonymous",
                label: isPeerReview ? "Anonymous responses" : "Anonymous voting",
                hint: isPeerReview
                  ? "Reviewer identity is hidden from the admin."
                  : "Voter identity is never recorded against a choice.",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3 transition-colors",
                  votingMode === opt.value ? "border-bronze-500 bg-bronze-50/50" : "border-line-200 hover:bg-surface-50"
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink-900">
                  <input
                    type="radio"
                    name="votingMode"
                    checked={votingMode === opt.value}
                    onChange={() => setVotingMode(opt.value)}
                    className="h-4 w-4 text-bronze-500 focus-ring"
                  />
                  {opt.label}
                </span>
                <span className="text-xs text-ink-500">{opt.hint}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink-900">Result visibility</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { value: "after_voting_ends", label: "Show results after it ends" },
            { value: "admin_only", label: "Only admin can see results" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-ink-900 transition-colors",
                resultVisibility === opt.value ? "border-bronze-500 bg-bronze-50/50" : "border-line-200 hover:bg-surface-50"
              )}
            >
              <input
                type="radio"
                name="resultVisibility"
                checked={resultVisibility === opt.value}
                onChange={() => setResultVisibility(opt.value)}
                className="h-4 w-4 text-bronze-500 focus-ring"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-2.5 rounded-xl border border-line-100 bg-surface-50 px-4 py-3">
        <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
        <p className="text-xs text-ink-600">
          {isPublicLink
            ? "Each person can submit once per campaign, identified by the employee ID they type in — not an account."
            : isPeerReview
              ? "Each employee can submit this form once, for one teammate of their choice. Responses can't be edited once submitted."
              : "Voting rule for this MVP: each employee can vote once per campaign. Votes cannot be changed once submitted."}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={(e) => handleSubmit(e, true)}
          disabled={submitting}
        >
          Save as Draft
        </Button>
        <Button type="submit" variant="accent" loading={submitting}>
          Create Campaign
        </Button>
      </div>
    </form>
  );
}