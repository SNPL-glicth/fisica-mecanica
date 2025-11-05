import React from 'react'

type Props = {
  Vx: number
  Vy: number
  Vr: number
  theta: number
}

export default function VectorDiagram({ Vx, Vy, Vr, theta }: Props) {
  const max = Math.max(Vx, Vy, 1)
  const scale = 100 / max // pixels per m/s inside diagram
  const vx = Vx * scale
  const vy = Vy * scale
  const vr = Math.hypot(vx, vy)

  const size = 140
  const origin = { x: 40, y: size - 30 }

  return (
    <div>
      <h3 className="text-base font-medium mb-3">Diagrama de Vectores</h3>
      <svg width="100%" height={size} viewBox={`0 0 ${size * 1.4} ${size}`} className="w-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fff" />
          </marker>
        </defs>
        {/* axes */}
        <g>
          <line x1={origin.x} y1={origin.y} x2={origin.x + vx} y2={origin.y} stroke="#00d9ff" strokeWidth={3} />
          <line x1={origin.x} y1={origin.y} x2={origin.x} y2={origin.y - vy} stroke="#0099ff" strokeWidth={3} />
          <line x1={origin.x} y1={origin.y} x2={origin.x + vx} y2={origin.y - vy} stroke="#00ff88" strokeWidth={3} />
        </g>

        {/* right triangle */}
        <polygon
          points={`${origin.x},${origin.y - vy} ${origin.x + vx},${origin.y} ${origin.x},${origin.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeDasharray="4 4"
        />

        {/* angle arc */}
        <path
          d={`M ${origin.x} ${origin.y - 22} A 22 22 0 0 1 ${origin.x + 22} ${origin.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
        />
        <text x={origin.x + 28} y={origin.y - 8} className="mono text-sm fill-white">{theta.toFixed(1)}°</text>

        {/* labels */}
        <text x={origin.x + vx / 2} y={origin.y + 16} className="mono text-xs fill-cyan">Vx</text>
        <text x={origin.x - 16} y={origin.y - vy / 2} className="mono text-xs fill-blue">Vy</text>
        <text x={origin.x + vx / 2 + 6} y={origin.y - vy / 2 - 6} className="mono text-xs fill-green">Vr</text>
      </svg>
    </div>
  )
}
