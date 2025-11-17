"use client";

import React from "react";

export type RainPoint = {
  fecha: string; // ISO date string
  precipitacion_mm: number;
};

type Props = {
  data: RainPoint[];
  height?: number;
};

export default function RainChart({ data, height = 200 }: Props) {
  if (!data.length) return null;

  const values = data.map((d) => d.precipitacion_mm || 0);
  const max = Math.max(...values, 1);

  const width = 360;
  const padding = 28;
  const chartHeight = height - padding * 2;
  const barGap = 4;
  const barWidth = Math.max(4, (width - padding * 2 - barGap * (data.length - 1)) / data.length);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-40 text-white/70"
      aria-label="Gráfico de precipitación diaria"
    >
      {/* Eje base */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#4b5563"
        strokeWidth={1}
      />

      {data.map((d, i) => {
        const x = padding + i * (barWidth + barGap);
        const h = (d.precipitacion_mm / max) * chartHeight;
        const y = height - padding - h;
        return (
          <g key={d.fecha}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={2}
              className="fill-cyan/70 hover:fill-cyan cursor-pointer transition-colors"
            />
            {/* valor numérico encima de la barra */}
            <text
              x={x + barWidth / 2}
              y={y - 4}
              textAnchor="middle"
              className="fill-white/60"
              fontSize={9}
            >
              {d.precipitacion_mm.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Etiqueta de max */}
      <text
        x={width - padding}
        y={padding - 6}
        textAnchor="end"
        className="fill-white/50"
        fontSize={10}
      >
        máx: {max.toFixed(1)} mm
      </text>
    </svg>
  );
}
