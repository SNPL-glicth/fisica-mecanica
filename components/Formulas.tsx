'use client'

import React, { useState } from 'react'
export default function Formulas({ impactDt, Cd }: { impactDt: number, Cd: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-base font-medium">Fórmulas</h3>
        <span className="text-cyan text-sm">{open ? 'Ocultar' : 'Mostrar'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3 text-sm">
          <Formula
            title="Primera Ley de Newton"
            expr="ΣF = 0 → v = constante"
            tip="Si no hay fuerzas horizontales netas, la componente Vx permanece constante (inercia)."
          />
          <Formula
            title="Segunda Ley de Newton"
            expr="F = m·a"
            tip="La aceleración vertical se debe a la gravedad y al arrastre; en el impacto F ≈ m·Δv/Δt."
          />
          <Formula
            title="Velocidad Terminal"
            expr="Vt = √(2·m·g / (ρ·A·Cd))"
            tip={`Cd≈${Cd} para esfera; A=πr²; cuando |v|→Vt las fuerzas se equilibran y a→0.`}
          />
          <Formula
            title="Velocidad Resultante"
            expr="Vr = √(Vx² + Vy²)"
            tip="Combinación vectorial de las componentes ortogonales del movimiento."
          />
          <Formula
            title="Ángulo"
            expr="θ = arctan(Vx/Vy)"
            tip="Ángulo entre la vertical (Vy) y la resultante Vr."
          />
          <Formula
            title="Fuerza de Impacto"
            expr={`F = m·Vr / Δt (Δt≈${impactDt}s)`}
            tip="Aproximación impulsiva: la gota se detiene en un tiempo muy corto al tocar el suelo."
          />
        </div>
      )}
    </div>
  )
}

function Formula({ title, expr, tip }: { title: string, expr: string, tip: string }) {
  return (
    <div className="p-3 rounded border border-white/10 hover:border-cyan/40 transition group">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white/80 text-xs">{title}</div>
          <div className="mono text-[13px] text-white">{expr}</div>
        </div>
        <span className="text-cyan/80 text-xs opacity-0 group-hover:opacity-100 transition">{tip}</span>
      </div>
    </div>
  )
}
