import { prisma } from "@/lib/prisma"; 

export async function GET() {
  const budgets = await prisma.budget.findMany();
  return Response.json(budgets);

}
