"use client";

import { useEffect, useRef, useState } from "react";
import {
  getActiveCustomFieldsForModule,
  getCustomFieldValuesForRecord,
} from "@/app/actions/custom-fields";
import { Card } from "@/components/Card";

export type CustomFieldDef = {
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

export type CustomValues = Record<string, string | number | boolean | null>;

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/40";
const labelCls = "block text-sm font-medium text-gray-700";

/**
 * Renders the active custom fields for a module inline, after the fixed
 * fields of an Add/Edit modal. Renders nothing when no active fields exist so
 * existing workflows are completely unchanged until an admin configures them.
 */
export function CustomFieldRenderer({
  moduleKey,
  recordId,
  onValuesChange,
}: {
  moduleKey: string;
  recordId?: string;
  onValuesChange?: (values: CustomValues) => void;
}) {
  const [fields, setFields] = useState<CustomFieldDef[] | null>(null);
  const [values, setValues] = useState<CustomValues>({});
  const changedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fieldRows, savedValues] = await Promise.all([
          getActiveCustomFieldsForModule(moduleKey),
          recordId ? getCustomFieldValuesForRecord(recordId) : Promise.resolve({} as Record<string, never>),
        ]);
        if (cancelled) return;
        setFields(fieldRows);
        changedRef.current = false;
        setValues(savedValues);
      } catch {
        if (!cancelled) setFields([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [moduleKey, recordId]);

  useEffect(() => {
    if (changedRef.current) {
      onValuesChange?.(values);
    }
  }, [values, onValuesChange]);

  if (!fields || fields.length === 0) return null;

  function setValue(fieldKey: string, value: string | number | boolean) {
    changedRef.current = true;
    setValues((prev) => ({ ...prev, [fieldKey]: value }));
  }

  return (
    <Card className="mt-6">
      <h3 className="mb-1 text-sm font-semibold text-gray-900">Additional Fields</h3>
      <p className="mb-4 text-xs text-gray-500">
        Extra information configured for this module.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const current = values[field.fieldKey];
          const required = field.required;

          return (
            <div key={field.id}>
              <label className={labelCls}>
                {field.label} {required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "dropdown" && (
                <select
                  value={(current as string) ?? ""}
                  onChange={(e) => setValue(field.fieldKey, e.target.value)}
                  className={inputCls}
                  required={required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "toggle" && (
                <div className="mt-1.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setValue(field.fieldKey, current ? false : true)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      current ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                    aria-pressed={!!current}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                        current ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600">{current ? "Yes" : "No"}</span>
                </div>
              )}

              {field.type === "date" && (
                <input
                  type="date"
                  value={(current as string) ?? ""}
                  onChange={(e) => setValue(field.fieldKey, e.target.value)}
                  className={inputCls}
                  required={required}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  value={(current as string | number) ?? ""}
                  onChange={(e) => setValue(field.fieldKey, e.target.value)}
                  className={inputCls}
                  required={required}
                />
              )}

              {field.type === "text" && (
                <input
                  type="text"
                  value={(current as string) ?? ""}
                  onChange={(e) => setValue(field.fieldKey, e.target.value)}
                  className={inputCls}
                  required={required}
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
