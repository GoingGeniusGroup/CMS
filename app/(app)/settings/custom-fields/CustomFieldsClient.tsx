"use client";

import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
  ListChecks,
} from "lucide-react";
import { Card } from "@/components/Card";
import { CUSTOM_FIELD_TYPES } from "@/lib/config/custom-field-types";
import { useConfig } from "@/components/ConfigProvider";
import {
  saveCustomField,
  deleteCustomField,
  setCustomFieldActive,
  reorderCustomField,
  type CustomFieldInput,
} from "@/app/actions/custom-fields";

type FieldRow = {
  id: string;
  moduleKey: string;
  fieldKey: string;
  label: string;
  type: string;
  options: string[];
  required: boolean;
  displayOrder: number;
  isActive: boolean;
};

type FieldEditorState = {
  open: boolean;
  editing: FieldRow | null;
  moduleKey: string;
};

const MODULE_LABELS: Record<string, string> = {
  customer: "Customers",
  project: "Projects",
  service: "Services",
  team: "Team",
  invoice: "Invoices",
  blog: "Blog",
  job: "Vacancies",
  applicant: "Applicants",
  category: "Categories",
  page: "Pages",
  faq: "FAQs",
};

export default function CustomFieldsClient({
  initialFields,
  modules,
}: {
  initialFields: FieldRow[];
  modules: string[];
}) {
  const [fields, setFields] = useState<FieldRow[]>(initialFields);
  const [editor, setEditor] = useState<FieldEditorState>({
    open: false,
    editing: null,
    moduleKey: modules[0] ?? "customer",
  });
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { entityLabel } = useConfig();

  // Modules with a dynamic entity label (adapts to the active industry profile);
  // modules not in this list (e.g. "applicant", "faq") fall back to MODULE_LABELS.
  function moduleDisplayName(moduleKey: string): string {
    const dynamicKeys = ["customer", "project", "service", "team", "invoice", "blog", "job", "category", "page"];
    if (dynamicKeys.includes(moduleKey)) {
      return entityLabel(moduleKey, { plural: true, fallback: MODULE_LABELS[moduleKey] ?? moduleKey });
    }
    return MODULE_LABELS[moduleKey] ?? moduleKey;
  }

  function notify(res: { success: boolean; error?: string; added?: number }, ok: string) {
    setMessage(
      res.success
        ? { type: "success", text: res.added ? `${res.added} suggestion(s) added.` : ok }
        : { type: "error", text: res.error ?? "Action failed." }
    );
  }

  function handleToggleActive(field: FieldRow) {
    startTransition(async () => {
      const res = await setCustomFieldActive(field.id, !field.isActive);
      if (res.success) {
        setFields((prev) =>
          prev.map((f) => (f.id === field.id ? { ...f, isActive: !f.isActive } : f))
        );
      }
      notify(res, "Field updated.");
    });
  }

  function handleReorder(field: FieldRow, direction: "up" | "down") {
    startTransition(async () => {
      const res = await reorderCustomField(field.id, direction);
      if (res.success) {
        setFields((prev) => {
          const copy = [...prev];
          const index = copy.findIndex((f) => f.id === field.id);
          const swapIndex = direction === "up" ? index - 1 : index + 1;
          if (swapIndex < 0 || swapIndex >= copy.length) return prev;
          const moduleIndex = copy.findIndex((f) => f.id === field.id);
          const sameModule = copy.filter((f) => f.moduleKey === field.moduleKey);
          const others = copy.filter((f) => f.moduleKey !== field.moduleKey);
          const from = sameModule.findIndex((f) => f.id === field.id);
          const to = direction === "up" ? from - 1 : from + 1;
          if (to < 0 || to >= sameModule.length) return prev;
          const [moved] = sameModule.splice(from, 1);
          sameModule.splice(to, 0, moved);
          void moduleIndex;
          return [...others, ...sameModule];
        });
      }
      notify(res, "Order updated.");
    });
  }

  function handleDelete(field: FieldRow) {
    if (!window.confirm(`Delete the custom field "${field.label}"? This removes stored values too.`)) return;
    startTransition(async () => {
      const res = await deleteCustomField(field.id);
      if (res.success) {
        setFields((prev) => prev.filter((f) => f.id !== field.id));
      }
      notify(res, "Field deleted.");
    });
  }

  function openCreate(moduleKey: string) {
    setEditor({ open: true, editing: null, moduleKey });
  }

  function openEdit(field: FieldRow) {
    setEditor({ open: true, editing: field, moduleKey: field.moduleKey });
  }

  const grouped = modules.map((moduleKey) => ({
    moduleKey,
    fields: fields
      .filter((f) => f.moduleKey === moduleKey)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  }));

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <ListChecks className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-base font-bold text-amber-500 sm:text-lg">Custom Fields</h1>
            <p className="text-xs text-zinc-500">
              Add extra fields that appear in Add/Edit modals per module.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <p
          className={`mb-6 rounded-lg px-4 py-2 text-sm font-medium ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="space-y-6">
        {grouped.map(({ moduleKey, fields: moduleFields }) => (
          <Card key={moduleKey}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <h2 className="text-base font-bold text-zinc-800">
                {moduleDisplayName(moduleKey)}
                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                  {moduleFields.length}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCreate(moduleKey)}
                  className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Field
                </button>
              </div>
            </div>

            {moduleFields.length === 0 ? (
              <p className="px-5 py-6 text-sm text-zinc-500">
                No custom fields yet. Add one above.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {moduleFields.map((field) => (
                  <li
                    key={field.id}
                    className={`flex flex-wrap items-center gap-3 px-5 py-3 ${!field.isActive ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleReorder(field, "up")}
                        disabled={isPending}
                        aria-label="Move up"
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(field, "down")}
                        disabled={isPending}
                        aria-label="Move down"
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-800">{field.label}</p>
                      <p className="truncate text-xs text-zinc-500">
                        {field.fieldKey} · {field.type}
                        {field.required ? " · required" : ""}
                        {!field.isActive ? " · inactive" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(field)}
                      disabled={isPending}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        field.isActive ? "bg-emerald-500" : "bg-zinc-300"
                      }`}
                      aria-pressed={field.isActive}
                      title={field.isActive ? "Active" : "Inactive"}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                          field.isActive ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(field)}
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                      aria-label="Edit field"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(field)}
                      className="rounded-lg border border-zinc-200 p-2 text-rose-500 hover:bg-rose-50"
                      aria-label="Delete field"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      {editor.open && (
        <FieldEditorModal
          editor={editor}
          onClose={() => setEditor((e) => ({ ...e, open: false }))}
          onSaved={(saved) => {
            setEditor((e) => ({ ...e, open: false }));
            setFields((prev) => {
              if (editor.editing) {
                return prev.map((f) => (f.id === saved.id ? saved : f));
              }
              return [...prev, saved];
            });
          }}
        />
      )}
    </>
  );
}

function FieldEditorModal({
  editor,
  onClose,
  onSaved,
}: {
  editor: FieldEditorState;
  onClose: () => void;
  onSaved: (field: FieldRow) => void;
}) {
  const editing = editor.editing;
  const { entityLabel } = useConfig();
  const dynamicKeys = ["customer", "project", "service", "team", "invoice", "blog", "job", "category", "page"];
  const moduleName = dynamicKeys.includes(editor.moduleKey)
    ? entityLabel(editor.moduleKey, { plural: true, fallback: MODULE_LABELS[editor.moduleKey] ?? editor.moduleKey })
    : MODULE_LABELS[editor.moduleKey] ?? editor.moduleKey;
  const [label, setLabel] = useState(editing?.label ?? "");
  const [fieldKey, setFieldKey] = useState(editing?.fieldKey ?? "");
  const [type, setType] = useState(editing?.type ?? "text");
  const [optionsText, setOptionsText] = useState((editing?.options ?? []).join("\n"));
  const [required, setRequired] = useState(editing?.required ?? false);
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    const payload: CustomFieldInput = {
      id: editing?.id,
      moduleKey: editor.moduleKey,
      fieldKey: fieldKey.trim(),
      label: label.trim(),
      type,
      options: type === "dropdown" ? optionsText.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      required,
      displayOrder: editing?.displayOrder ?? 0,
      isActive,
    };
    const res = await saveCustomField(payload);
    setSubmitting(false);
    if (!res.success || !res.id) {
      setError(res.error ?? "Failed to save field");
      return;
    }
    onSaved({
      id: res.id,
      moduleKey: editor.moduleKey,
      fieldKey: payload.fieldKey,
      label: payload.label,
      type,
      options: payload.options,
      required,
      displayOrder: editing?.displayOrder ?? 0,
      isActive,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">
          {editing ? "Edit Custom Field" : "Add Custom Field"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">Module: {moduleName}</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Account Manager"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Field Key</label>
            <input
              type="text"
              value={fieldKey}
              onChange={(e) => setFieldKey(e.target.value)}
              placeholder="e.g. accountManager"
              disabled={!!editing}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40 disabled:bg-zinc-50 disabled:text-zinc-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
            >
              {CUSTOM_FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {type === "dropdown" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Options (one per line)
              </label>
              <textarea
                rows={3}
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder={"Option 1\nOption 2\nOption 3"}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
          )}
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Required
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Active
            </label>
          </div>
        </div>

        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !label.trim() || !fieldKey.trim()}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Field"}
          </button>
        </div>
      </div>
    </div>
  );
}
