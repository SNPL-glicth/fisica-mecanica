'use client'

import React from 'react'

type Props = {
  width: number
  height: number
  scale: number
}

export default function UrbanLandscape({ width, height, scale }: Props) {
  const pixelSize = 4
  const groundLevel = height * 0.85
  
  return (
    <svg 
      width={width} 
      height={height} 
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {/* Street/Ground */}
      <rect
        x={0}
        y={groundLevel}
        width={width}
        height={height - groundLevel}
        fill="#2a2a2a"
      />
      
      {/* Street lines */}
      <line
        x1={0}
        y1={groundLevel + (height - groundLevel) * 0.5}
        x2={width}
        y2={groundLevel + (height - groundLevel) * 0.5}
        stroke="#ffcc00"
        strokeWidth={2}
        strokeDasharray="16 12"
      />
      
      {/* Buildings */}
      <Building x={width * 0.1} y={groundLevel} pixelSize={pixelSize} type="tall" />
      <Building x={width * 0.3} y={groundLevel} pixelSize={pixelSize} type="medium" />
      <Building x={width * 0.5} y={groundLevel} pixelSize={pixelSize} type="short" />
      <Building x={width * 0.7} y={groundLevel} pixelSize={pixelSize} type="medium" />
      <Building x={width * 0.85} y={groundLevel} pixelSize={pixelSize} type="tall" />
    </svg>
  )
}

function Building({ x, y, pixelSize, type }: { x: number, y: number, pixelSize: number, type: 'tall' | 'medium' | 'short' }) {
  const heights = {
    tall: 20,
    medium: 14,
    short: 10
  }
  
  const buildingHeight = heights[type] * pixelSize
  const buildingWidth = 12 * pixelSize
  
  const buildingColors = ['#3a4f5f', '#4a5f6f', '#2a3f4f']
  const buildingColor = buildingColors[Math.floor(Math.random() * buildingColors.length)]
  
  // Building body
  const building: JSX.Element[] = []
  
  // Main structure
  building.push(
    <rect
      key="main"
      x={x}
      y={y - buildingHeight}
      width={buildingWidth}
      height={buildingHeight}
      fill={buildingColor}
      stroke="#1a2a3a"
      strokeWidth={1}
    />
  )
  
  // Windows (pixel art style)
  const windowRows = Math.floor(heights[type] / 3)
  const windowCols = 2
  
  for (let row = 0; row < windowRows; row++) {
    for (let col = 0; col < windowCols; col++) {
      const wx = x + (col + 1) * 3 * pixelSize
      const wy = y - buildingHeight + (row + 1) * 3 * pixelSize
      
      // Randomly lit windows
      const isLit = Math.random() > 0.4
      
      building.push(
        <rect
          key={`window-${row}-${col}`}
          x={wx}
          y={wy}
          width={pixelSize * 2}
          height={pixelSize * 2}
          fill={isLit ? '#ffee88' : '#1a2a3a'}
        />
      )
    }
  }
  
  // Roof
  building.push(
    <rect
      key="roof"
      x={x - pixelSize}
      y={y - buildingHeight - pixelSize * 2}
      width={buildingWidth + pixelSize * 2}
      height={pixelSize * 2}
      fill="#2a2a2a"
    />
  )
  
  return <g>{building}</g>
}
