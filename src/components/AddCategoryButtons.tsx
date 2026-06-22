import { CategoryType } from "@/lib/types";

type AddCategoryButtonsProps = {
  onAdd: (type: CategoryType) => void;
};

export default function AddCategoryButtons({ onAdd }: AddCategoryButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onAdd("INCOME")}
        className="rounded border border-green-300 px-3 py-1 text-green-700 hover:bg-green-50"
      >
        + Income
      </button>
      <button
        onClick={() => onAdd("EXPENSE")}
        className="rounded border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50"
      >
        + Expense
      </button>
    </div>
  );
}
