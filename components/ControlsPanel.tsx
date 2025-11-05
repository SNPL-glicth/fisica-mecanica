'use client'

import React from 'react'
type Props = {
  wind: number
  setWind: (v: number) => void
  diameterMM: number
  setDiameterMM: (v: number) => void
  heightM: number
  setHeightM: (v: number) => void
  rhoAir: number
  setRhoAir: (v: number) => void
  paused: boolean
  setPaused: (v: boolean) => void
  showForceVectors: boolean
  setShowForceVectors: (v: boolean) => void
  onReset: () => void
}

export default function ControlsPanel({
  wind,
  setWind,
  diameterMM,
  setDiameterMM,
  heightM,
  setHeightM,
  rhoAir,
  setRhoAir,
  paused,
  setPaused,
  showForceVectors,
  setShowForceVectors,
  onReset
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Controles</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(!paused)}
            className="px-3 py-1.5 rounded border border-cyan/40 hover:border-cyan text-cyan text-sm"
          >
            {paused ? 'Reanudar' : 'Pausar'}
          </button>
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded border border-blue/40 hover:border-blue text-blue text-sm"
          >
            Reiniciar
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex justify-between text-sm mb-2">
            <span className="text-white/80">Velocidad del Viento</span>
            <span className="mono text-cyan">{wind.toFixed(2)} m/s</span>
          </label>
          <input
            className="input-range"
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={wind}
            onChange={(e) => setWind(parseFloat(e.target.value))}
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>0</span>
            <span>20</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm mb-2">
            <span className="text-white/80">Diámetro de la Gota</span>
            <span className="mono text-cyan">{diameterMM.toFixed(2)} mm</span>
          </label>
          <input
            className="input-range"
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={diameterMM}
            onChange={(e) => setDiameterMM(parseFloat(e.target.value))}
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>1</span>
            <span>5</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm mb-2">
            <span className="text-white/80">Altura de Caída</span>
            <span className="mono text-cyan">{heightM.toFixed(0)} m</span>
          </label>
          <input
            className="input-range"
            type="range"
            min={100}
            max={1000}
            step={10}
            value={heightM}
            onChange={(e) => setHeightM(parseFloat(e.target.value))}
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>100</span>
            <span>1000</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm mb-2">
            <span className="text-white/80">Densidad del Aire</span>
            <span className="mono text-cyan">{rhoAir.toFixed(3)} kg/m³</span>
          </label>
          <input
            className="input-range"
            type="range"
            min={1.0}
            max={1.3}
            step={0.001}
            value={rhoAir}
            onChange={(e) => setRhoAir(parseFloat(e.target.value))}
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>1.0</span>
            <span>1.3</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-white/80 text-sm">Mostrar Vectores de Fuerza</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={showForceVectors}
                onChange={(e) => setShowForceVectors(e.target.checked)}
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  showForceVectors ? 'bg-cyan' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    showForceVectors ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </label>
          <p className="text-xs text-white/50 mt-2">
            {showForceVectors
              ? 'Visualizando fuerzas: Fg (amarillo), Fa (rojo), Fneta (blanco)'
              : 'Visualizando velocidades: Vx (cian), Vy (azul), Vr (verde)'}
          </p>
        </div>
      </div>
    </div>
  )
}
