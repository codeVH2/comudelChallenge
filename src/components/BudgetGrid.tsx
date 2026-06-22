import { MONTHS, CategoryDTO } from "@/lib/types";

type BudgetGridProps = {
  categories: CategoryDTO[];
  onCellChange: (categoryId: string, month: number, amount: number) => void;
  onNameChange: (categoryId: string, name: string) => void;
  onRemoveCategory: (categoryId: string) => void;
};

export default function BudgetGrid({
  categories,
  onCellChange,
  onNameChange,
  onRemoveCategory,
}: BudgetGridProps) {
  const income = categories.filter((c) => c.type === "INCOME");
  const expense = categories.filter((c) => c.type === "EXPENSE");
  const colSpan = MONTHS.length + 2; // category + 12 months + remove column

  function renderRow(category: CategoryDTO) {
    return (
      <tr key={category.id}>
        <td className="border p-1">
          <input
            type="text"
            value={category.name}
            onChange={(e) => onNameChange(category.id, e.target.value)}
            className="w-full p-1 font-medium"
          />
        </td>
        {category.months.map((m) => {
          const signed = category.type === "EXPENSE" ? -m.amount : m.amount;
          return (
            <td key={m.month} className="border p-1">
              <input
                type="number"
                value={signed}
                onChange={(e) =>
                  onCellChange(
                    category.id,
                    m.month,
                    Math.abs(Number(e.target.value)),
                  )
                }
                className="w-20 text-right p-1"
              />
            </td>
          );
        })}
        <td className="border p-1 text-center">
          <button
            onClick={() => onRemoveCategory(category.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Remove category"
          >
            ✕
          </button>
        </td>
      </tr>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">Category</th>
          {MONTHS.map((month) => (
            <th key={month} className="border p-2">
              {month}
            </th>
          ))}
          <th className="border p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            colSpan={colSpan}
            className="border bg-green-50 p-2 font-semibold text-green-700"
          >
            Income
          </td>
        </tr>
        {income.map(renderRow)}

        <tr>
          <td
            colSpan={colSpan}
            className="border bg-red-50 p-2 font-semibold text-red-700"
          >
            Expense
          </td>
        </tr>
        {expense.map(renderRow)}
      </tbody>
    </table>
  );
}
