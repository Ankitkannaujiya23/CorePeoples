import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

export default function VoteConfirmation({ open, candidate, onCancel, onConfirm, submitting }) {
  if (!candidate) return null;

  return (
    <Modal open={open} onClose={onCancel} title="Confirm your vote" size="sm">
      <div className="flex flex-col items-center text-center">
        <Avatar name={candidate.name} color={candidate.avatarColor} size="lg" />
        <p className="mt-3 text-sm text-ink-600">You are voting for</p>
        <p className="text-base font-semibold text-ink-900">{candidate.name}</p>
        <p className="mt-3 rounded-lg bg-surface-100 px-3 py-2 text-xs text-ink-600">
          You can vote only once in this campaign. This can&apos;t be undone.
        </p>
      </div>
      <div className="mt-5 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="accent" className="flex-1" onClick={onConfirm} loading={submitting}>
          Confirm Vote
        </Button>
      </div>
    </Modal>
  );
}
