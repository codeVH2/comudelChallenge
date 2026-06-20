// Shared, serialization-friendly types passed between the API and the UI.
// Decimal values from Prisma are converted to plain numbers at the API boundary.

export type CategoryType = "INCOME" | "EXPENSE";

export interface MonthlyEntryDTO {
  month: number; // 1..12
  amount: number; // positive magnitude
}

export interface CategoryDTO {
  id: string;
  name: string;
  type: CategoryType;
  sortOrder: number;
  entries: MonthlyEntryDTO[]; // always length 12, month 1..12
}

export interface BudgetTotals {
  receitaTotal: number;
  despesaTotal: number;
  resultado: number;
  saldoInicial: number;
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

export const MONTHS_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;