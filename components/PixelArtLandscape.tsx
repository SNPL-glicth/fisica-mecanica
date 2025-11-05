'use client'

import React from 'react'

type Props = {
  width: number
  height: number
  scale: number // pixels per meter
}

export default function PixelArtLandscape({ width, height, scale }: Props) {
  const pixelSize = 4 // size of each pixel block in device pixels
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        pointerEvents: 'none',
        overflow: 'hidden',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    >
      {/* Horizon line */}
      <line 
        x1={0} 
        y1={height * 0.85} 
        x2={width} 
        y2={height * 0.85} 
        stroke="rgba(255,255,255,0.1)" 
        strokeWidth={1}
      />
      
      {/* Grass strip at bottom - pixel art style */}
      <Grass width={width} height={height} pixelSize={pixelSize} />
      
      {/* Tree on the right side */}
      <Tree x={width * 0.85} y={height * 0.85} pixelSize={pixelSize} />
    </svg>
  )
}

function Grass({ width, height, pixelSize }: { width: number, height: number, pixelSize: number }) {
  const grassHeight = height * 0.15 // 15% of canvas
  const grassY = height - grassHeight
  const grassColors = ['#1a4d2e', '#2d5a3d', '#1e5631', '#234d32']
  
  const pixels: JSX.Element[] = []
  const cols = Math.ceil(width / pixelSize)
  const rows = Math.ceil(grassHeight / pixelSize)
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * pixelSize
      const y = grassY + row * pixelSize
      const color = grassColors[Math.floor(Math.random() * grassColors.length)]
      
      pixels.push(
        <rect
          key={`grass-${row}-${col}`}
          x={x}
          y={y}
          width={pixelSize}
          height={pixelSize}
          fill={color}
          opacity={0.9}
        />
      )
    }
  }
  
  return <g>{pixels}</g>
}

function Tree({ x, y, pixelSize }: { x: number, y: number, pixelSize: number }) {
  const trunk = [
    // Trunk (brown)
    { x: 0, y: -8, color: '#4a2511' },
    { x: 0, y: -7, color: '#5a3520' },
    { x: 0, y: -6, color: '#4a2511' },
    { x: 0, y: -5, color: '#5a3520' },
    { x: 0, y: -4, color: '#4a2511' },
    { x: 1, y: -8, color: '#5a3520' },
    { x: 1, y: -7, color: '#4a2511' },
    { x: 1, y: -6, color: '#5a3520' },
    { x: 1, y: -5, color: '#4a2511' },
    { x: 1, y: -4, color: '#5a3520' },
  ]
  
  const foliage = [
    // Foliage layer 1 (top)
    { x: -1, y: -14, color: '#1a5c2e' },
    { x: 0, y: -14, color: '#267a3f' },
    { x: 1, y: -14, color: '#1a5c2e' },
    { x: 2, y: -14, color: '#267a3f' },
    
    // Layer 2
    { x: -2, y: -13, color: '#267a3f' },
    { x: -1, y: -13, color: '#1a5c2e' },
    { x: 0, y: -13, color: '#2d8f4a' },
    { x: 1, y: -13, color: '#267a3f' },
    { x: 2, y: -13, color: '#1a5c2e' },
    { x: 3, y: -13, color: '#267a3f' },
    
    // Layer 3
    { x: -2, y: -12, color: '#1a5c2e' },
    { x: -1, y: -12, color: '#2d8f4a' },
    { x: 0, y: -12, color: '#267a3f' },
    { x: 1, y: -12, color: '#2d8f4a' },
    { x: 2, y: -12, color: '#267a3f' },
    { x: 3, y: -12, color: '#1a5c2e' },
    
    // Layer 4
    { x: -1, y: -11, color: '#267a3f' },
    { x: 0, y: -11, color: '#1a5c2e' },
    { x: 1, y: -11, color: '#267a3f' },
    { x: 2, y: -11, color: '#1a5c2e' },
    
    // Layer 5
    { x: -2, y: -10, color: '#1a5c2e' },
    { x: -1, y: -10, color: '#267a3f' },
    { x: 0, y: -10, color: '#2d8f4a' },
    { x: 1, y: -10, color: '#267a3f' },
    { x: 2, y: -10, color: '#1a5c2e' },
    { x: 3, y: -10, color: '#267a3f' },
    
    // Layer 6
    { x: -1, y: -9, color: '#2d8f4a' },
    { x: 0, y: -9, color: '#267a3f' },
    { x: 1, y: -9, color: '#2d8f4a' },
    { x: 2, y: -9, color: '#267a3f' },
  ]
  
  return (
    <g>
      {trunk.map((pixel, i) => (
        <rect
          key={`trunk-${i}`}
          x={x + pixel.x * pixelSize}
          y={y + pixel.y * pixelSize}
          width={pixelSize}
          height={pixelSize}
          fill={pixel.color}
        />
      ))}
      {foliage.map((pixel, i) => (
        <rect
          key={`foliage-${i}`}
          x={x + pixel.x * pixelSize}
          y={y + pixel.y * pixelSize}
          width={pixelSize}
          height={pixelSize}
          fill={pixel.color}
        />
      ))}
    </g>
  )
}
