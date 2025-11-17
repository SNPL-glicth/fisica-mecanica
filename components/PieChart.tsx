"use client";

import React from "react";

export type PieSlice = {
  label: string;
  value: number;
  color?: string;
};

type Props = {
  data: PieSlice[];
};

const DEFAULT_COLORS = ["#22d3ee", "#4ade80", "#fbbf24", "#fb7185"];

export default function PieChart({ data }: Props) {
  const total = data.reduce((acc, d) => acc + (d.value || 0), 0);
  if (!total) return null;

  const radius = 40;
  const cx = 50;
  const cy = 50;
  const viewBox = "0 0 100 100";

  let startAngle = -90; // start at top

  return (
    <svg viewBox={viewBox} className="w-40 h-40">
      {data.map((slice, i) => {
        const value = slice.value || 0;
        const angle = (value / total) * 360;
        const endAngle = startAngle + angle;

        const largeArc = angle > 180 ? 1 : 0;

        const x1 = cx + radius * Math.cos((Math.PI / 180) * startAngle);
        const y1 = cy + radius * Math.sin((Math.PI / 180) * startAngle);
        const x2 = cx + radius * Math.cos((Math.PI / 180) * endAngle);
        const y2 = cy + radius * Math.sin((Math.PI / 180) * endAngle);

        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        const color = slice.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];

        startAngle = endAngle;

        return <path key={slice.label} d={pathData} fill={color} />;
      })}

      {/* círculo interior para efecto donut */}
      <circle cx={cx} cy={cy} r={radius * 0.5} fill="#020617" />

      {/* total en el centro */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        className="fill-white text-[10px]"
        dominantBaseline="middle"
      >
        {total.toFixed(1)} mm
      </text>
    </svg>
  );
}
