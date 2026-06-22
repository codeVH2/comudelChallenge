"use client";

type YearSelectorProps = {
  years: number[];
  value: number | null;
  onChange: (year: number) => void;
};

export default function YearSelector({
  years,
  value,
  onChange,
}: YearSelectorProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={years.length === 0}
      className="border rounded p-2"
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
}
