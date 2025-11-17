"use client";

import React, { useState } from "react";
import { useRainData, MonthBucket } from "@/lib/useRainData";
import PieChart from "./PieChart";
import MinecraftRainBackdrop from "./MinecraftRainBackdrop";

export default function RealDataSection() {
  const { loading, error, total, count, avg, monthsSorted, lastThreeMonths } =
    useRainData();
  const [selectedMonth, setSelectedMonth] = useState<MonthBucket | null>(null);

  return (
    <section id="datos-reales" className="relative space-y-6">
      <MinecraftRainBackdrop />
      {/* Bloque 1: título y resumen global */}
      <div className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-3">
        <header className="space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold text-cyan">
            Datos reales de lluvia
          </h2>
          <p className="text-white/70 text-sm">
            Serie de precipitación diaria agrupada por mes. Estos datos vienen de Open-Meteo y se pueden usar en clase
            para analizar la lluvia en la localidad.
          </p>
        </header>

        {loading && (
          <p className="text-white/70 text-sm">Cargando datos de lluvia…</p>
        )}
        {error && !loading && (
          <p className="text-red-400 text-sm">
            No se pudieron cargar los datos: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SummaryCard label="Registros" value={count} />
              <SummaryCard label="Suma (mm)" value={total.toFixed(1)} mono />
              <SummaryCard label="Promedio (mm)" value={avg.toFixed(2)} mono />
            </div>

            {/* Mini contexto físico: cómo conectar estos mm de lluvia con la mecánica */}
            <div className="mt-3 rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-[11px] sm:text-xs text-white/70 space-y-1">
              <p>
                <strong>Cómo leer estos datos:</strong> cada valor de precipitación (mm) indica cuántos milímetros de
                agua cayeron sobre <span className="mono">1 m²</span> en ese día. Por ejemplo, <span className="mono">10 mm</span>
                equivalen a <span className="mono">10 L</span> de agua por metro cuadrado.
              </p>
              <p>
                Si conoces ese volumen, puedes estimar masa (<span className="mono">m = ρ·V</span>) y luego la fuerza
                de la gravedad <span className="mono">Fg ≈ m·g</span> que acelera las gotas. Esa aceleración está
                conectada con la 2ª Ley de Newton (<span className="mono">F = m·a</span>) y explica por qué la lluvia
                gana velocidad al caer hasta que el rozamiento del aire la equilibra.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Bloque 2: tarjetas independientes para los últimos 3 meses */}
      {!loading && !error && lastThreeMonths.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-3">
          <h3 className="text-sm sm:text-base font-semibold text-cyan">
            Últimos tres meses
          </h3>
          <p className="text-xs sm:text-sm text-white/60">
            Cada tarjeta muestra, para un mes, cuántos días llovió y cuánta lluvia total cayó. Haz clic para ver una
            explicación más detallada.
          </p>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {lastThreeMonths.map((month) => {
              // Si todos los días tienen lluvia (p.ej. octubre), el segmento de "sin lluvia" sería 0
              // y el gráfico se vería como un círculo sólido. Para mantener contraste visual,
              // añadimos un valor mínimo muy pequeño al segmento sin lluvia.
              const hasOnlyRain = month.rainyDays > 0 && month.dryDays === 0;
              const dryValue = hasOnlyRain ? 0.001 : month.dryDays;

              const pieData = [
                { label: "Días con lluvia", value: month.rainyDays },
                { label: "Días sin lluvia", value: dryValue },
              ];
              return (
                <button
                  key={month.monthKey}
                  type="button"
                  onClick={() => setSelectedMonth(month)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-cyan/30 bg-black/60 px-3 py-3 hover:border-cyan/70 hover:bg-black/80 transition-colors text-left"
                >
                  <h4 className="text-sm sm:text-base font-semibold text-cyan capitalize text-center">
                    {month.label}
                  </h4>
                  <PieChart data={pieData} />
                  <p className="text-[11px] sm:text-xs text-white/80 text-center">
                    Total: <span className="mono">{month.total.toFixed(1)} mm</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-white/60 text-center">
                    Días con lluvia: <span className="mono">{month.rainyDays}</span> · sin lluvia:{" "}
                    <span className="mono">{month.dryDays}</span>
                  </p>
                </button>
              );
            })}
          </div>

          {/* leyenda de colores del gráfico de pastel */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-white/70">
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#22d3ee' }} />
              <span>Días con lluvia</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#4ade80' }} />
              <span>Días sin lluvia</span>
            </div>
          </div>
        </div>
      )}

      {/* Bloque 3: detalle por mes (solo últimos 3 meses) */}
      {!loading && !error && monthsSorted.length > 0 && (
        <div className="space-y-4">
          {monthsSorted.slice(-3).map((month) => (
            <MonthDetailSection key={month.monthKey} month={month} />
          ))}
        </div>
      )}

      {selectedMonth && (
        <MonthModal month={selectedMonth} onClose={() => setSelectedMonth(null)} />
      )}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2">
      <div className="text-white/60 text-xs">{label}</div>
      <div className={`text-lg ${mono ? "mono" : ""}`}>{value}</div>
    </div>
  );
}

function MonthDetailSection({ month }: { month: MonthBucket }) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
      <header className="px-3 py-2 bg-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h3 className="text-sm sm:text-base font-semibold capitalize">{month.label}</h3>
          <p className="text-[11px] text-white/60">
            Registros: {month.records.length} · Suma: {month.total.toFixed(1)} mm · Promedio:
            {" "}
            {month.avgPerDay.toFixed(2)} mm/día
          </p>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-white/5 text-white/80">
            <tr>
              <th className="text-left px-3 py-2">Fecha</th>
              <th className="text-right px-3 py-2">Precipitación (mm)</th>
              <th className="text-left px-3 py-2">Fuente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {month.records.map((r, i) => (
              <tr
                key={`${r.date}-${i}`}
                className={i % 2 === 0 ? "bg-black/20" : "bg-black/10"}
              >
                <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
                <td className="px-3 py-2 text-right mono">{r.precipitation.toFixed(1)}</td>
                <td className="px-3 py-2">{r.source ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MonthModal({ month, onClose }: { month: MonthBucket; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3">
      <div className="max-w-lg w-full bg-slate-900 rounded-xl border border-white/15 p-4 sm:p-5 shadow-xl relative">
        <button
          className="absolute top-2 right-2 text-xs text-white/60 hover:text-white"
          onClick={onClose}
        >
          Cerrar ✕
        </button>
        <h2 className="text-lg font-semibold text-cyan mb-2 capitalize">
          Lluvia en {month.label}
        </h2>
        <p className="text-sm text-white/80 mb-3">Resumen del mes:</p>
        <ul className="text-sm text-white/80 space-y-1 mb-4">
          <li>Total registrado: <span className="mono">{month.total.toFixed(1)} mm</span></li>
          <li>Días con lluvia: <span className="mono">{month.rainyDays}</span></li>
          <li>Días sin lluvia: <span className="mono">{month.dryDays}</span></li>
          {month.maxDay && (
            <li>
              Día más lluvioso: <span className="mono">{month.maxDay.date}</span> con{' '}
              <span className="mono">{month.maxDay.precipitation.toFixed(1)} mm</span>
            </li>
          )}
        </ul>

        <h3 className="text-sm font-semibold text-cyan mb-1">Relación con las leyes de Newton</h3>
        <p className="text-xs sm:text-sm text-white/70 mb-1">
          Cada milímetro de lluvia indica cuánta agua cayó sobre 1 m². Si pensamos en una gota:
        </p>
        <ul className="text-xs sm:text-sm text-white/70 list-disc list-inside space-y-1 mb-2">
          <li>
            <strong>1ª Ley (inercia):</strong> la gota tendería a seguir recta, pero la gravedad cambia su
            movimiento hacia abajo.
          </li>
          <li>
            <strong>2ª Ley (F = m·a):</strong> la aceleración depende de la masa de la gota y de la fuerza neta
            (peso menos rozamiento del aire).
          </li>
          <li>
            <strong>3ª Ley (acción y reacción):</strong> al golpear techo o suelo, la gota ejerce una fuerza y la
            superficie responde con otra igual y opuesta.
          </li>
        </ul>
        <p className="text-xs sm:text-sm text-white/60">
          Con estos datos se puede estimar cuántas gotas caen en 1 m² en ese mes y, con una masa aproximada por gota,
          calcular fuerzas usando las leyes de Newton.
        </p>
      </div>
    </div>
  );
}
