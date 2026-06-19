import { useState, useCallback } from "react";

const STORAGE_KEY = "spot-recommender-daily-usage";
const DAILY_LIMIT = 10;

interface DailyUsage {
  date: string; // YYYY-MM-DD
  count: number;
  shownSpots: string[]; // 已推荐的景点名称列表
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getStoredUsage(): DailyUsage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const usage = JSON.parse(stored) as Partial<DailyUsage>;
      // 如果不是今天的记录，重置
      if (usage.date !== getToday()) {
        return { date: getToday(), count: 0, shownSpots: [] };
      }
      // 确保 shownSpots 存在（兼容旧版数据）
      return {
        date: usage.date || getToday(),
        count: usage.count || 0,
        shownSpots: Array.isArray(usage.shownSpots) ? usage.shownSpots : [],
      };
    }
  } catch {
    // ignore parse errors
  }
  return { date: getToday(), count: 0, shownSpots: [] };
}

function saveUsage(usage: DailyUsage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore storage errors
  }
}

export function useDailyLimit() {
  const [usage, setUsage] = useState<DailyUsage>(getStoredUsage);

  const remaining = Math.max(0, DAILY_LIMIT - usage.count);
  const isLimitReached = usage.count >= DAILY_LIMIT;
  const shownSpots = usage.shownSpots;

  const consumeOne = useCallback((spotName?: string): boolean => {
    const current = getStoredUsage();
    if (current.count >= DAILY_LIMIT) {
      return false;
    }
    const newShownSpots = spotName && !current.shownSpots.includes(spotName)
      ? [...current.shownSpots, spotName]
      : current.shownSpots;
    const newUsage = {
      ...current,
      count: current.count + 1,
      shownSpots: newShownSpots,
    };
    saveUsage(newUsage);
    setUsage(newUsage);
    return true;
  }, []);

  const clearShownSpots = useCallback(() => {
    const current = getStoredUsage();
    const newUsage = { ...current, shownSpots: [] };
    saveUsage(newUsage);
    setUsage(newUsage);
  }, []);

  return {
    remaining,
    isLimitReached,
    consumeOne,
    dailyLimit: DAILY_LIMIT,
    shownSpots,
    clearShownSpots,
  };
}
