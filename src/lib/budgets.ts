import { prisma } from "@/lib/prisma";
import { computeTotal } from "@/lib/calculations";
import { BudgetDTO } from "@/lib/types";

export async function getBudgetWithTotals(id: string,): Promise<BudgetDTO | null> {

  const budget = await prisma.budget.findUnique({
    where: { id },
    include: { categories: { include: { months: true } } },
  });

  if (!budget) {
    return null;
  }

  const categories = budget.categories.map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
    months: category.months.map((month) => ({
      month: month.month,
      amount: Number(month.amount),
    })),
  }));

  const totals = computeTotal(categories, Number(budget.initialBalance));

  return {
    id: budget.id,
    year: budget.year,
    companyName: budget.companyName,
    initialBalance: Number(budget.initialBalance),
    categories,
    totals,
  };
}
