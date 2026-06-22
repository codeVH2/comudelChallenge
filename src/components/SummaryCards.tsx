import { BudgetTotals } from "@/lib/types";

type SummaryCardsProps = {
  totals: BudgetTotals;
};


export default function SummaryCards({ totals }: SummaryCardsProps) {
  const cards = [
    { label: "Income", value: totals.incomeTotal },
    { label: "Expense", value: totals.expenseTotal },
    { label: "Result", value: totals.result },
    { label: "Initial Balance", value: totals.initialBalance },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {cards.map((card) => (
        <div key={card.label} className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-2xl font-bold">
            {card.value.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
