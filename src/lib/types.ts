export type CategoryType = "INCOME" | "EXPENSE";

export interface MonthlyEntryDTO {
  month: number; // 1..12
  amount: number; // positive magnitude
}

export interface CategoryDTO {
  id: string;
  name: string;
  type: CategoryType;
  months: MonthlyEntryDTO[]; // always length 12, month 1..12
}

export interface BudgetTotals {
  incomeTotal: number;
  expenseTotal: number;
  result: number;
  initialBalance: number;
}

export interface BudgetDTO {
  id: string;
  year: number;
  companyName: string;
  initialBalance: number;
  categories: CategoryDTO[];
  totals: BudgetTotals;
}

export interface BudgetSummary {
  id: string;
  year: number;
  companyName: string;
  totals: BudgetTotals;
}

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;