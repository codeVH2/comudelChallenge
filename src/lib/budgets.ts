import { prisma } from "@/lib/prisma";
import { computeTotal } from "@/lib/calculations";

export async function getBudgetWithTotals(id: string) {
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: { categories: { include: { months: true } } },
  });

  if (!budget) {
    return null;
  }

  const categories = budget.categories.map((category) => ({
    ...category,
    months: category.months.map((month) => ({
      ...month,
      amount: Number(month.amount),
    })),
  }));

  const totals = computeTotal(categories, Number(budget.initialBalance));

  return { ...budget, categories, totals };
}
