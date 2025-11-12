"use client";

import React, { useEffect, useState } from "react";

type RegistroLluvia = {
  fecha: string; // ISO o dd/mm/aaaa
  precipitacion_mm: number;
  fuente?: string;
};

export default function RealDataSection() {
  const [data, setData] = useState<RegistroLluvia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        const res = await fetch("/datos/lluvia.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as RegistroLluvia[];
        if (!cancel) {
          setData(json);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancel) {
          setError(e?.message ?? "Error cargando datos");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancel = true;
    };
  }, []);

  const totalRegistros = data.length;
  const totalPrecipitacion = data.reduce((acc, r) => acc + (r.precipitacion_mm || 0), 0);
  const promedio = totalRegistros > 0 ? totalPrecipitacion / totalRegistros : 0;

  return (
    <section id="datos-reales" className="card p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-cyan">Datos reales de lluvia</h2>
      <p className="text-white/70 text-sm mb-3">
        Serie de precipitaciones medidas en la localidad. Reemplaza el archivo <code className="mono">public/datos/lluvia.json</code>
        con tus registros reales.
      </p>
      {loading && <p className="text-white/70">Cargando…</p>}
      {error && !loading && (
        <p className="text-red-400">No se pudieron cargar los datos: {error}</p>
      )}
      {!loading && !error && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-white/5 rounded p-2">
              <div className="text-white/60 text-xs">Registros</div>
              <div className="mono text-base">{totalRegistros}</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-white/60 text-xs">Suma (mm)</div>
              <div className="mono text-base">{totalPrecipitacion.toFixed(1)}</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-white/60 text-xs">Promedio (mm)</div>
              <div className="mono text-base">{promedio.toFixed(2)}</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="text-left px-3 py-2">Fecha</th>
                  <th className="text-right px-3 py-2">Precipitación (mm)</th>
                  <th className="text-left px-3 py-2">Fuente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.map((r, i) => (
                  <tr key={`${r.fecha}-${i}`} className="hover:bg-white/5">
                    <td className="px-3 py-2 whitespace-nowrap">{r.fecha}</td>
                    <td className="px-3 py-2 text-right mono">{Number(r.precipitacion_mm).toFixed(1)}</td>
                    <td className="px-3 py-2">{r.fuente ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
