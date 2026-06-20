import { prisma } from "@/lib/prisma"; 
import { computeTotal } from "@/lib/calculations";


export async function GET(
    request: Request,
    {params}: {params: Promise <{id: string}>}
){

    const { id } = await params;

    const budget = await prisma.budget.findUnique({
        where: { id },
        include: { categories: { include: { months: true } } },
    });

    if (!budget) {
        return Response.json({ error: "Budget not found" }, { status: 404 });
    }

    const categories = budget.categories.map((category) =>({
        ...category,
        months: category.months.map((month) => ({
            ...month,
            amount: Number(month.amount)
        }))
    }))

    const totals = computeTotal(categories, Number(budget.initialBalance));

    return Response.json({ ...budget, categories, totals });

}