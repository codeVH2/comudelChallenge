"use client";

import { useState, useEffect } from "react";
import YearSelector from "@/components/YearSelector";
import SummaryCards from "@/components/SummaryCards";
import BudgetGrid from "@/components/BudgetGrid";
import SaveChangesButton from "@/components/SaveChangesButton";
import NewBudgetForm from "@/components/NewBudgetForm";
import DeleteBudgetButton from "@/components/DeleteBudgetButton";
import AddCategoryButtons from "@/components/AddCategoryButtons";
import { BudgetDTO, CategoryDTO } from "@/lib/types";

type Budget = { id: string; year: number };

export default function Page() {
  const [year, setYear] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budget, setBudget] = useState<BudgetDTO | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    fetch("/api/budgets")
      .then((res) => res.json())
      .then((data) => {
        setBudgets(data);
        if (data.length > 0) {
          const saved = Number(localStorage.getItem("selectedYear"));
          const exists = data.some((b: Budget) => b.year === saved);
          setYear(exists ? saved : data[0].year);
        }
      });
  }, []);
  const years = budgets.map((b) => b.year);

  useEffect(() => {
    if (year !== null) {
      localStorage.setItem("selectedYear", String(year));
    }
  }, [year]);

  useEffect(() => {
    if (year === null) return;

    const selected = budgets.find((b) => b.year === year);
    if (!selected) return;

    fetch(`/api/budgets/${selected.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBudget(data);
        setCategories(data.categories);
      });
  }, [year, budgets]);

  function createBudget(newYear: number, initialBalance: number) {
    fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: newYear, initialBalance }),
    }).then((res) => {
      if (res.status === 409) {
        res.json().then((data) => alert(data.error));
        return;
      }
      res.json().then((created) => {
        setBudgets((prev) => [...prev, { id: created.id, year: created.year }]);
        setYear(created.year);
      });
    });
  }

  function deleteBudget() {
    if (!budget) return;
    if (!confirm(`Delete the ${budget.year} budget?`)) return;

    const id = budget.id;
    fetch(`/api/budgets/${id}`, { method: "DELETE" }).then((res) => {
      if (!res.ok) return;
      const remaining = budgets.filter((b) => b.id !== id);
      setBudgets(remaining);
      setBudget(null);
      setCategories([]);
      setYear(remaining.length > 0 ? remaining[0].year : null);
    });
  }

  function updateCell(categoryId: string, month: number, amount: number) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id !== categoryId
          ? cat // outra categoria → intacta
          : {
              ...cat, // copia a categoria
              months: cat.months.map(
                (m) =>
                  m.month !== month
                    ? m // outro mês → intacto
                    : { ...m, amount }, // ESTE mês → cópia com novo amount
              ),
            },
      ),
    );
  }

  function addCategory(type: "INCOME" | "EXPENSE") {
    const newCategory: CategoryDTO = {
      id: crypto.randomUUID(), // id temporário; o backend gera o real ao guardar
      name: "New Category",
      type,
      months: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        amount: 0,
      })),
    };
    setCategories((prev) => [...prev, newCategory]);
  }

  function updateCategoryName(categoryId: string, name: string) {
    setCategories((prev) =>
      prev.map((cat) => (cat.id !== categoryId ? cat : { ...cat, name })),
    );
  }

  function removeCategory(categoryId: string) {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!confirm(`Delete the "${category?.name}" category?`)) return;
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  }

  function saveBudget() {
    if (!budget) return;

    const body = {
      categories: categories.map((cat) => ({
        name: cat.name,
        type: cat.type,
        months: cat.months.map((m) => ({ month: m.month, amount: m.amount })),
      })),
    };

    fetch(`/api/budgets/${budget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setBudget(data);
        setCategories(data.categories);
      });
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Comudel</h1>
        <div className="flex items-center gap-4">
          <YearSelector years={years} value={year} onChange={setYear} />
          {budget && <DeleteBudgetButton onDelete={deleteBudget} />}
          <NewBudgetForm onCreate={createBudget} />
        </div>
      </header>

      <main className="p-4 space-y-4">
        {budget && <SummaryCards totals={budget.totals} />}
        {budget && (
          <BudgetGrid
            categories={categories}
            onCellChange={updateCell}
            onNameChange={updateCategoryName}
            onRemoveCategory={removeCategory}
          />
        )}
        {budget && <AddCategoryButtons onAdd={addCategory} />}
        {budget && <SaveChangesButton onSave={saveBudget} />}
      </main>
    </>
  );
}
