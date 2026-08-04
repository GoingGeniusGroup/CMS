"use client";

import { useRef, useState, useTransition } from "react";
import { Download, Upload, FileJson, AlertTriangle } from "lucide-react";
import { Card } from "@/components/Card";
import { exportConfig, importConfig } from "@/app/actions/config-transfer";

export function ImportExportClient() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, startImport] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setIsExporting(true);
    setMessage(null);
    try {
      const config = await exportConfig();
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cms-config-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: "success", text: "Configuration exported successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to export configuration." });
    } finally {
      setIsExporting(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      startImport(async () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          const result = await importConfig(parsed);
          if (result.success && result.summary) {
            const s = result.summary;
            setMessage({
              type: "success",
              text: `Imported: ${s.labelOverrides} labels, ${s.customFields} custom fields, ${s.statusOptions} statuses, ${s.departments} departments, ${s.tagModules} tag module(s).`,
            });
          } else {
            setMessage({ type: "error", text: result.error ?? "Import failed." });
          }
        } catch {
          setMessage({ type: "error", text: "That file isn't valid JSON." });
        }
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <FileJson className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-base font-bold text-amber-500 sm:text-lg">Import / Export Configuration</h1>
            <p className="text-xs text-zinc-500">
              Move labels, custom fields, status workflows, departments, and tags between environments.
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-1 text-sm font-bold text-zinc-800">Export</h3>
          <p className="mb-4 text-xs text-zinc-500">
            Download the current configuration (labels, custom fields, status workflows, departments,
            tags, and general/currency settings) as a JSON file. No customer, project, or invoice data
            is included.
          </p>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Configuration"}
          </button>
        </Card>

        <Card>
          <h3 className="mb-1 text-sm font-bold text-zinc-800">Import</h3>
          <p className="mb-4 text-xs text-zinc-500">
            Upload a previously exported JSON file. Existing entries are matched and updated
            (by entity key / module + field key); nothing is duplicated.
          </p>
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Importing overwrites matching labels, fields, and statuses in this environment.</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {isImporting ? "Importing..." : "Choose File to Import"}
          </button>
        </Card>
      </div>
    </>
  );
}
