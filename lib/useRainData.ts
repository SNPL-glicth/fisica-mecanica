"use client";

import { useEffect, useMemo, useState } from "react";

export type RainRecord = {
  date: string; // ISO 'YYYY-MM-DD'
  precipitation: number; // mm
  source?: string;
};

export type MonthBucket = {
  monthKey: string; // YYYY-MM
  label: string; // e.g. "septiembre 2025"
  records: RainRecord[];
  total: number;
  avgPerDay: number;
  rainyDays: number;
  dryDays: number;
  maxDay: RainRecord | null;
};

export function useRainData() {
  const [records, setRecords] = useState<RainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        const res = await fetch("/api/lluvia");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as RainRecord[];
        if (cancel) return;
        setRecords(json);
        setLoading(false);
      } catch (e: any) {
        if (cancel) return;
        setError(e?.message ?? "Error cargando datos de lluvia");
        setLoading(false);
      }
    }
    load();
    return () => {
      cancel = true;
    };
  }, []);

  const { byMonth, monthsSorted, lastThreeMonths, total, count, avg } = useMemo(() => {
    const groups: Record<string, RainRecord[]> = {};
    for (const r of records) {
      const d = new Date(r.date);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }

    const entries: MonthBucket[] = Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, recs]) => {
        recs.sort((a, b) => a.date.localeCompare(b.date));
        const sample = recs[0];
        const d = new Date(sample.date);
        const label = !isNaN(d.getTime())
          ? d.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
          : key;
        const total = recs.reduce((acc, r) => acc + (r.precipitation || 0), 0);
        const rainyDays = recs.filter((r) => (r.precipitation || 0) > 0).length;
        const dryDays = recs.length - rainyDays;
        const maxDay = recs.reduce<RainRecord | null>((max, r) => {
          if (!max) return r;
          return r.precipitation > max.precipitation ? r : max;
        }, null);
        const avgPerDay = recs.length > 0 ? total / recs.length : 0;
        return {
          monthKey: key,
          label,
          records: recs,
          total,
          avgPerDay,
          rainyDays,
          dryDays,
          maxDay,
        };
      });

  const monthsSorted = entries;
  const lastThreeMonths = entries.slice(-3);
  const total = records.reduce((acc, r) => acc + (r.precipitation || 0), 0);
  const count = records.length;
  const avg = count > 0 ? total / count : 0;

    return {
      byMonth: groups,
      monthsSorted,
      lastThreeMonths,
      total,
      count,
      avg,
    };
  }, [records]);

  return {
    records,
    loading,
    error,
    total,
    count,
    avg,
    monthsSorted,
    lastThreeMonths,
  };
}
