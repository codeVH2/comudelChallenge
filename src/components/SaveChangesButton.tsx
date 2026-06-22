type SaveChangesButtonProps = {
  onSave: () => void;
  saving?: boolean;
};

export default function SaveChangesButton({
  onSave,
  saving,
}: SaveChangesButtonProps) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save Budget"}
    </button>
  );
}
