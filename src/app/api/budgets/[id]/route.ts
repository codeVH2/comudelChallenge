import { prisma } from "@/lib/prisma";
import { getBudgetWithTotals } from "@/lib/budgets";
import { updateBudgetSchema } from "@/lib/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const budget = await getBudgetWithTotals(id);

  if (!budget) {
    return Response.json({ error: "Budget not found" }, { status: 404 });
  }

  return Response.json(budget);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await request.json();

  const parsed = updateBudgetSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  const existing = await prisma.budget.findUnique({ where: { id } });

  if (!existing) {
    return Response.json({ error: "Budget not found" }, { status: 404 });
  }

  //sei que o bugdet existe e a data esta validada com zod, falta gravar

  await prisma.$transaction(async (tx) => {
    await tx.category.deleteMany({ where: { budgetId: id } });

    for (const category of data.categories) {
      await tx.category.create({
        data: {
          budgetId: id,
          name: category.name,
          type: category.type,
          months: {
            create: category.months.map((m) => ({
              month: m.month,
              amount: m.amount,
            })),
          },
        },
      });
    }
  });

  const updated = await getBudgetWithTotals(id);

  return Response.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const existing = await prisma.budget.findUnique({ where: { id } });

  if (!existing) {
    return Response.json({ error: "Budget not found" }, { status: 404 });
  }

  await prisma.budget.delete({where: {id} });

  return new Response(null, { status: 204 })
}