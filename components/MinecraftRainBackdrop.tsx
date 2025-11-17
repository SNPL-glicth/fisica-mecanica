"use client";

import React from "react";

export default function MinecraftRainBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -right-6 bottom-6 opacity-40 sm:opacity-60 filter saturate-150">
        <svg
          width="220"
          height="160"
          viewBox="0 0 220 160"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* fondo */}
          <rect x="0" y="0" width="220" height="160" fill="url(#bgGrad)" />

          {/* suelo */}
          <rect x="0" y="120" width="220" height="40" fill="#0f3b21" />
          <rect x="0" y="118" width="220" height="4" fill="#166534" />

          {/* tronco del árbol */}
          <rect x="40" y="70" width="20" height="50" fill="#854d0e" />
          {/* copa del árbol */}
          <rect x="26" y="46" width="48" height="10" fill="#14532d" />
          <rect x="26" y="56" width="48" height="10" fill="#15803d" />
          <rect x="32" y="36" width="36" height="10" fill="#16a34a" />

          {/* manzana tipo pixel art */}
          <rect x="120" y="90" width="32" height="30" fill="#b91c1c" />
          <rect x="124" y="86" width="8" height="6" fill="#166534" />
          <rect x="136" y="86" width="6" height="4" fill="#16a34a" />
          <rect x="124" y="100" width="6" height="6" fill="#f97373" />

          {/* gotas de lluvia estilizadas */}
          <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
            <line x1="10" y1="10" x2="4" y2="22" />
            <line x1="28" y1="18" x2="22" y2="30" />
            <line x1="70" y1="8" x2="64" y2="20" />
            <line x1="95" y1="22" x2="89" y2="34" />
            <line x1="150" y1="12" x2="144" y2="24" />
            <line x1="185" y1="6" x2="179" y2="18" />
          </g>

          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
