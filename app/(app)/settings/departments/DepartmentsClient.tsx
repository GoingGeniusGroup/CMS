"use client";

import { useState, useTransition } from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/Card";
import { createDepartment, deleteDepartment } from "@/app/actions/team";

type Department = {
  id: string;
  name: string;
  order: number;
};

export function DepartmentsClient({ initialDepartments }: { initialDepartments: Department[] }) {
  const [departments, setDepartments] = useState(initialDepartments);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Department name is required");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createDepartment(trimmed);
      if (result.success && result.department) {
        setDepartments((prev) => [...prev, result.department!].sort((a, b) => a.order - b.order));
        setName("");
      } else {
        setError(result.error ?? "Failed to add department");
      }
    });
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteDepartment(id);
      if (result.success) {
        setDepartments((prev) => prev.filter((d) => d.id !== id));
      }
      setDeletingId(null);
    });
  }

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-base font-bold text-amber-500 sm:text-lg">Departments</h1>
            <p className="text-xs text-zinc-500">
              Manage the department list used across Team and Careers modules.
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-black">New Department</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Marketing"
              className="h-11 w-full rounded-lg border border-zinc-200 px-4 text-sm text-black shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
            />
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        </div>
      </Card>

      <Card noPadding className="overflow-hidden">
        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Building2 className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">No departments yet. Add your first one above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {departments.map((dept) => (
              <li key={dept.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-zinc-700">{dept.name}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(dept.id)}
                  disabled={isPending && deletingId === dept.id}
                  className="text-zinc-400 hover:text-rose-500 disabled:opacity-50"
                  aria-label={`Delete ${dept.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
