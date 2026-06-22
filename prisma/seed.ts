import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, CategoryType } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Sample 2026 budget reproducing the numbers from the mockup grid.
// Expense amounts are stored as positive magnitudes — the sign is derived
// from the category type when totals are computed.
type SeedCategory = {
  name: string;
  type: CategoryType;
  monthly: number[]; // 12 values, Jan..Dez
};

const CATEGORIES: SeedCategory[] = [
  {
    name: "Vendas",
    type: "INCOME",
    monthly: [8000, 8500, 9000, 9200, 9500, 9800, 10000, 10000, 10500, 11000, 11500, 12000],
  },
  {
    name: "Serviços",
    type: "INCOME",
    monthly: [2000, 2200, 2100, 2300, 2400, 2500, 2600, 2600, 2700, 2800, 2900, 3000],
  },
  {
    name: "Salários",
    type: "EXPENSE",
    monthly: [3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500],
  },
  {
    name: "Marketing",
    type: "EXPENSE",
    monthly: [500, 700, 600, 800, 500, 900, 700, 600, 750, 800, 650, 900],
  },
  {
    name: "Infraestrutura",
    type: "EXPENSE",
    monthly: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200],
  },
  {
    name: "Software",
    type: "EXPENSE",
    monthly: [300, 300, 300, 450, 300, 300, 300, 300, 450, 300, 300, 450],
  },
];

async function main() {
  // Idempotent: wipe any existing 2026 budget so re-running the seed is safe.
  await prisma.budget.deleteMany({ where: { year: 2026 } });

  const budget = await prisma.budget.create({
    data: {
      year: 2026,
      companyName: "Comudel",
      initialBalance: 10000,
      categories: {
        create: CATEGORIES.map((cat) => ({
          name: cat.name,
          type: cat.type,
          months: {
            create: cat.monthly.map((amount, i) => ({
              month: i + 1,
              amount,
            })),
          },
        })),
      },
    },
  });

  console.log(`Seeded budget ${budget.year} (id=${budget.id}) with ${CATEGORIES.length} categories.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });