import { prisma } from "@/lib/prisma";
import { createBudgetSchema } from "@/lib/validation";

export async function GET() {
  const budgets = await prisma.budget.findMany();
  return Response.json(budgets);
}

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = createBudgetSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  const existing = await prisma.budget.findUnique({
    where: { year: data.year },
  });

  if (existing) {
    return Response.json(
      { error: "A budget already exists for this year" },
      { status: 409 },
    );
  }

  const newBudget = await prisma.budget.create({
    data: {
      year: data.year,
      companyName: data.companyName,
      initialBalance: data.initialBalance,
    },
  });

  return Response.json(newBudget, { status: 201 });
}
