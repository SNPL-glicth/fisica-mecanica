'use client'

import ControlsPanel from '@/components/ControlsPanel'
import SimulationCanvas from '@/components/SimulationCanvas'
import VectorDiagram from '@/components/VectorDiagram'
import DataTable from '@/components/DataTable'
import Formulas from '@/components/Formulas'
import { useState, useMemo } from 'react'
import { angleThetaDeg, computeArea, computeMass, fallTime, resultantVr, terminalVelocityY } from '@/lib/physics'

export default function Page() {
  const [wind, setWind] = useState(8) // m/s
  const [diameterMM, setDiameterMM] = useState(3) // mm
  const [heightM, setHeightM] = useState(500) // m
  const [paused, setPaused] = useState(false)
  const g = 9.81
  const rhoAir = 1.225
  const Cd = 0.47

  const derived = useMemo(() => {
    const d_m = diameterMM / 1000
    const m = computeMass(d_m)
    const A = computeArea(d_m)
    const vt = terminalVelocityY(m, rhoAir, A, Cd)
    const Vy = vt
    const Vx = wind
    const Vr = resultantVr(Vx, Vy)
    const theta = angleThetaDeg(Vx, Vy)
    const tFall = fallTime(heightM, vt, g)
    const massMg = m * 1e6
    const impactDt = 0.01 // s, supuesto
    const F = (m * Vr) / impactDt
    return { d_m, m, A, vt, Vy, Vx, Vr, theta, tFall, massMg, F, impactDt }
  }, [diameterMM, wind, heightM])

  return (
    <main className="px-4 py-8 md:py-10 max-w-7xl mx-auto">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Lluvia, Inercia y Fuerza: Simulación Interactiva
        </h1>
        <p className="text-white/70 mt-2">
          Dark mode estilo Cursor. Ajusta viento, tamaño de gota y altura. Observa cómo la inercia (1ª Ley) y
          F=ma (2ª Ley) gobiernan la caída.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Izquierda 60% */}
        <div className="lg:col-span-3 xl:col-span-3 card p-2 md:p-3">
          <SimulationCanvas
            wind={wind}
            diameterMM={diameterMM}
            heightM={heightM}
            paused={paused}
          />
        </div>

        {/* Derecha 40% */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-4">
          <div className="card p-4">
            <ControlsPanel
              wind={wind}
              setWind={setWind}
              diameterMM={diameterMM}
              setDiameterMM={setDiameterMM}
              heightM={heightM}
              setHeightM={setHeightM}
              paused={paused}
              setPaused={setPaused}
              onReset={() => {
                setWind(8)
                setDiameterMM(3)
                setHeightM(500)
              }}
            />
          </div>

          <div className="card p-4">
            <VectorDiagram Vx={derived.Vx} Vy={derived.Vy} Vr={derived.Vr} theta={derived.theta} />
          </div>

          <div className="card p-4">
            <DataTable
              vt={derived.vt}
              Vx={derived.Vx}
              Vr={derived.Vr}
              theta={derived.theta}
              massMg={derived.massMg}
              force={derived.F}
              tFall={derived.tFall}
              impactDt={derived.impactDt}
            />
          </div>

          <div className="card p-4">
            <Formulas impactDt={derived.impactDt} Cd={Cd} />
          </div>
        </div>
      </section>
    </main>
  )
}
