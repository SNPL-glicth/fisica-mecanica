import React from 'react'

function format(n: number, digits = 2) {
  return n.toFixed(digits)
}

type Props = {
  vt: number
  Vx: number
  Vr: number
  theta: number
  massMg: number
  force: number
  dragForce: number
  gravityForce: number
  netForce: number
  rhoAir: number
  tFall: number
  impactDt: number
}

export default function DataTable({ vt, Vx, Vr, theta, massMg, force, dragForce, gravityForce, netForce, rhoAir, tFall, impactDt }: Props) {
  const rows = [
    { k: 'Velocidad Terminal (Vy)', v: `${format(vt)} m/s`, color: 'text-blue' },
    { k: 'Velocidad del Viento (Vx)', v: `${format(Vx)} m/s`, color: 'text-cyan' },
    { k: 'Velocidad Resultante (Vr)', v: `${format(Vr)} m/s`, color: 'text-green' },
    { k: 'Ángulo de Incidencia (θ)', v: `${format(theta)}°`, color: 'text-white' },
    { k: 'Densidad del Aire (ρ)', v: `${format(rhoAir, 3)} kg/m³`, color: 'text-white' },
    { k: 'Masa de la Gota', v: `${format(massMg)} mg`, color: 'text-white' },
    { k: 'Fuerza de Gravedad (Fg)', v: `${format(gravityForce, 6)} N`, color: 'text-yellow-400' },
    { k: 'Fuerza de Arrastre (Fa)', v: `${format(dragForce, 6)} N`, color: 'text-red-400' },
    { k: 'Fuerza Neta (Fneta)', v: `${format(netForce, 6)} N`, color: 'text-white' },
    { k: 'Fuerza de Impacto (F)', v: `${format(force)} N`, color: 'text-white' },
    { k: 'Tiempo de Caída', v: `${format(tFall)} s`, color: 'text-white' }
  ]
  return (
    <div>
      <h3 className="text-base font-medium mb-3">Valores Calculados</h3>
      <div className="divide-y divide-white/10">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between py-2">
            <span className="text-white/70">{r.k}</span>
            <span className={`mono ${r.color}`}>{r.v}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-white/50 mt-3">F = m·Vr / Δt con Δt = {impactDt}s (supuesto para impacto breve)</p>
    </div>
  )
}
