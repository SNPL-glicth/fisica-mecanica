'use client'

import React from 'react'
type Props = {
  wind: number
  setWind: (v: number) => void
  diameterMM: number
  setDiameterMM: (v: number) => void
  heightM: number
  setHeightM: (v: number) => void
  paused: boolean
  setPaused: (v: boolean) => void
  onReset: () => void
}

export default function ControlsPanel({
  wind,
  setWind,
  diameterMM,
  setDiameterMM,
  heightM,
  setHeightM,
  paused,
  setPaused,
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
      </div>
    </div>
  )
}
