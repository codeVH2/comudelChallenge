import { z } from "zod";


export const monthlyEntrySchema = z.object({
  month: z.number().int().min(1).max(12),
  amount: z.number().nonnegative(),
});

export const categorySchema = z.object({
  name: z.string().nonempty(),
  type: z.enum(["INCOME", "EXPENSE"]),
  sortOrder: z.number().int().nonnegative(),
  months: z.array(monthlyEntrySchema).length(12)
});

export const updateBudgetSchema = z.object({
  initialBalance: z.number(),
  categories: z.array(categorySchema)
});


export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

export const createBudgetSchema = z.object({
  year: z.number().int(),
  initialBalance: z.number().optional(),
  companyName: z.string().min(1).optional()
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

