import { useState, useCallback } from "react";

const STORAGE_KEY = "excluded_spots";

interface ExcludedEntry {
  name: string;
  reason: "not_interested" | "visited";
  addedAt: number;
}

function loadExcluded(): ExcludedEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExcluded(list: ExcludedEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useExcludedSpots() {
  const [excluded, setExcluded] = useState<ExcludedEntry[]>(loadExcluded);

  const excludeSpot = useCallback((name: string, reason: "not_interested" | "visited") => {
    setExcluded((prev) => {
      // 避免重复添加
      if (prev.some((e) => e.name === name)) return prev;
      const next = [...prev, { name, reason, addedAt: Date.now() }];
      saveExcluded(next);
      return next;
    });
  }, []);

  const isExcluded = useCallback(
    (name: string) => excluded.some((e) => e.name === name),
    [excluded]
  );

  const excludedNames = excluded.map((e) => e.name);

  return { excludeSpot, isExcluded, excludedNames };
}
