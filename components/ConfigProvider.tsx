"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getEntityLabelsArray } from "@/app/actions/labels";
import { getStatusOptionsClient } from "@/app/actions/status-options";
import { getSidebarModuleConfig } from "@/app/actions/sidebar-nav";
import { DEFAULT_ENTITY_LABELS } from "@/lib/config/entity-labels";
import { DEFAULT_STATUS_OPTIONS } from "@/lib/config/status-options";
import type { StatusOptionDto } from "@/lib/status-options";

type LabelsMap = Record<string, { singular: string; plural: string }>;

type ConfigContextValue = {
  labels: LabelsMap;
  statusOptions: Record<string, StatusOptionDto[]>;
  disabledNavIds: string[];
  entityLabel: (key: string, opts?: { plural?: boolean; fallback?: string }) => string;
  statusOptionsFor: (moduleKey: string) => StatusOptionDto[];
  statusBadge: (moduleKey: string, value: string) => StatusOptionDto | undefined;
  refreshConfig: () => Promise<void>;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

function fallbackStatusOptions(): Record<string, StatusOptionDto[]> {
  const map: Record<string, StatusOptionDto[]> = {};
  for (const [moduleKey, seeds] of Object.entries(DEFAULT_STATUS_OPTIONS)) {
    map[moduleKey] = seeds.map((seed, i) => ({
      id: `seed-${moduleKey}-${seed.statusValue}`,
      moduleKey,
      statusValue: seed.statusValue,
      label: seed.label ?? seed.statusValue,
      color: seed.color,
      sortOrder: i,
      isDefault: Boolean(seed.isDefault),
      isActive: true,
    }));
  }
  return map;
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<LabelsMap>({ ...DEFAULT_ENTITY_LABELS });
  const [statusOptions, setStatusOptions] = useState<Record<string, StatusOptionDto[]>>(() =>
    fallbackStatusOptions()
  );
  const [disabledNavIds, setDisabledNavIds] = useState<string[]>([]);

  const loadConfig = useCallback(async () => {
    try {
      const [labelRows, statusMap, sidebarNav] = await Promise.all([
        getEntityLabelsArray(),
        getStatusOptionsClient(),
        getSidebarModuleConfig(),
      ]);

      const nextLabels: LabelsMap = { ...DEFAULT_ENTITY_LABELS };
      for (const row of labelRows) {
        nextLabels[row.entityKey] = { singular: row.singular, plural: row.plural };
      }
      setLabels(nextLabels);

      if (statusMap && Object.keys(statusMap).length > 0) {
        setStatusOptions(statusMap);
      }

      setDisabledNavIds(sidebarNav.disabled);
    } catch {
      // Keep current values — the admin panel stays fully functional without config.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) return;
      await loadConfig();
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [loadConfig]);

  const entityLabel = useCallback(
    (key: string, opts?: { plural?: boolean; fallback?: string }) => {
      const entry = labels[key];
      if (entry) return opts?.plural ? entry.plural : entry.singular;
      return opts?.fallback ?? key;
    },
    [labels]
  );

  const statusOptionsFor = useCallback(
    (moduleKey: string) => (statusOptions[moduleKey] ?? []).filter((o) => o.isActive),
    [statusOptions]
  );

  const statusBadge = useCallback(
    (moduleKey: string, value: string) =>
      (statusOptions[moduleKey] ?? []).find((o) => o.isActive && o.statusValue === value),
    [statusOptions]
  );

  const value = useMemo(
    () => ({
      labels,
      statusOptions,
      disabledNavIds,
      entityLabel,
      statusOptionsFor,
      statusBadge,
      refreshConfig: loadConfig,
    }),
    [labels, statusOptions, disabledNavIds, entityLabel, statusOptionsFor, statusBadge, loadConfig]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within a ConfigProvider");
  return ctx;
}

export function useEntityLabel(key: string, opts?: { plural?: boolean; fallback?: string }) {
  return useConfig().entityLabel(key, opts);
}

export function useStatusOptions(moduleKey: string): StatusOptionDto[] {
  return useConfig().statusOptionsFor(moduleKey);
}

export function useStatusBadge(moduleKey: string, value: string): StatusOptionDto | undefined {
  return useConfig().statusBadge(moduleKey, value);
}
