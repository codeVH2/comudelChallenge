import { z } from "zod";

export const monthlyEntrySchema = z.object({
  month: z.number().int().min(1).max(12),
  amount: z.number().nonnegative(),
});

export const categorySchema = z.object({
  name: z.string().nonempty(),
  type: z.enum(["INCOME", "EXPENSE"]),
  months: z.array(monthlyEntrySchema).length(12),
});

export const updateBudgetSchema = z.object({
  categories: z.array(categorySchema),
});

export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

export const createBudgetSchema = z.object({
  year: z.number().int(),
  initialBalance: z.number().optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
