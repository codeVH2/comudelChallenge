"use client";

import { useState } from "react";

type NewBudgetFormProps = {
  onCreate: (year: number, initialBalance: number) => void;
};

export default function NewBudgetForm({ onCreate }: NewBudgetFormProps) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  function handleCreate() {
    onCreate(Number(year), Number(initialBalance));
    setYear("");
    setInitialBalance("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded border px-3 py-1 hover:bg-gray-50"
      >
        + New Budget
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 space-y-2 rounded-lg border bg-white p-3 text-gray-900 shadow-lg">
          <label className="block text-sm">
            <span className="text-gray-600">Year</span>
            <input
              type="number"
              placeholder="2027"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 w-full rounded border p-1"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-600">Initial balance</span>
            <input
              type="number"
              placeholder="0"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              className="mt-1 w-full rounded border p-1"
            />
          </label>
          <button
            onClick={handleCreate}
            className="w-full rounded bg-blue-600 px-3 py-1 font-medium text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
}
