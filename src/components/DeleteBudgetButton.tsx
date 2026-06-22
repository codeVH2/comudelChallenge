type DeleteBudgetButtonProps = {
  onDelete: () => void;
};

export default function DeleteBudgetButton({
  onDelete,
}: DeleteBudgetButtonProps) {
  return (
    <button
      onClick={onDelete}
      className="rounded border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
