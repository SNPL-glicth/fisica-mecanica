'use client'

import React, { useEffect, useRef, useState } from 'react'
import { computeArea, computeMass, terminalVelocityY } from '@/lib/physics'
import PixelArtLandscape from './PixelArtLandscape'
type Drop = {
  x: number // m
  y: number // m (0 top -> H bottom)
  vy: number // m/s (down positive)
}

type Props = {
  wind: number // m/s
  diameterMM: number
  heightM: number
  paused: boolean
}

export default function SimulationCanvas({ wind, diameterMM, heightM, paused }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)
  const dropsRef = useRef<Drop[]>([])
  const lastRef = useRef<number>(0)
  const vtRef = useRef<number>(0)
  const [canvasDims, setCanvasDims] = useState({ width: 0, height: 0 })

  // Resize canvas to container
  useEffect(() => {
    const canvas = canvasRef.current!
    const parent = canvas.parentElement!

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = parent.clientWidth
      const h = Math.max(280, Math.min(640, Math.round((parent.clientWidth) * 0.66)))
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      setCanvasDims({ width: canvas.width, height: canvas.height })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [])

  // Init drops
  useEffect(() => {
    const N = 90 // number of drops
    const drops: Drop[] = []
    for (let i = 0; i < N; i++) {
      drops.push({ x: Math.random(), y: Math.random(), vy: 0 })
    }
    dropsRef.current = drops
  }, [])

  // Update vt when diameter changes
  useEffect(() => {
    const d_m = diameterMM / 1000
    const m = computeMass(d_m)
    const A = computeArea(d_m)
    vtRef.current = terminalVelocityY(m, 1.225, A, 0.47)
  }, [diameterMM])

  // Animation loop
  useEffect(() => {
    const g = 9.81
    const step = (ts: number) => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const dpr = window.devicePixelRatio || 1
      const width = canvas.width
      const height = canvas.height

      const Hm = heightM // world height meters
      const scale = height / Hm // px per meter (using device pixels)
      const Wm = width / scale // world width meters

      if (!lastRef.current) lastRef.current = ts
      const dt = Math.min(0.05, (ts - lastRef.current) / 1000)
      lastRef.current = ts

      // Clear
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = '#0f0f0f'
      ctx.fillRect(0, 0, width, height)

      // Subtle grid
      ctx.save()
      ctx.globalAlpha = 0.12
      ctx.strokeStyle = '#0b2a33'
      ctx.lineWidth = 1
      const grid = 64 * (window.devicePixelRatio || 1)
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      ctx.restore()

      // Physics update
      const vt = vtRef.current || 9 // fallback
      const drops = dropsRef.current
      const vx = wind // m/s constant horizontal (inercia)

      if (!paused) {
        for (let d of drops) {
          // map normalized x,y [0..1] to world meters
          let x_m = d.x * Wm
          let y_m = d.y * Hm

          // vertical dynamics: dv/dt = g * (1 - (v/vt)^2)
          const ay = g * (1 - (d.vy / vt) ** 2)
          d.vy += ay * dt
          y_m += d.vy * dt
          x_m += vx * dt

          // wrap horizontally
          if (x_m < 0) x_m += Wm
          if (x_m > Wm) x_m -= Wm

          // recycle drop at ground
          if (y_m > Hm) {
            y_m = 0
            d.vy = 0
          }

          // write back normalized
          d.x = x_m / Wm
          d.y = y_m / Hm
        }
      }

      // Draw drops and vectors
      const r_px = Math.max(1, (diameterMM / 1000 / 2) * scale)
      const arrowScale = Math.max(0.05 * scale, 0.5) // px per (m/s)

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      drops.forEach((d, i) => {
        const x = d.x * width
        const y = d.y * height

        // trail
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,217,255,0.12)'
        ctx.lineWidth = 1
        ctx.moveTo(x - vx * arrowScale * 0.2, y - d.vy * arrowScale * 0.2)
        ctx.lineTo(x, y)
        ctx.stroke()

        // drop
        ctx.beginPath()
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = 0.9
        ctx.arc(x, y, r_px, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        // vectors
        const vx_px = vx * arrowScale
        const vy_px = d.vy * arrowScale
        const vrx = vx_px
        const vry = vy_px

        // Vx (cyan)
        drawArrow(ctx, x, y, x + vx_px, y, '#00d9ff')
        // Vy (blue, down)
        drawArrow(ctx, x, y, x, y + vy_px, '#0099ff')
        // Vr (green)
        drawArrow(ctx, x, y, x + vrx, y + vry, '#00ff88')

        // Angle only for first few drops to reduce clutter
        if (i % 20 === 0) {
          drawAngle(ctx, x, y, vx_px, vy_px)
        }
      })

      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [wind, diameterMM, heightM, paused])

  const scale = canvasDims.height / heightM // px per meter

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-[50vh] rounded-lg border border-cyan/20" />
      {canvasDims.width > 0 && (
        <PixelArtLandscape 
          width={canvasDims.width} 
          height={canvasDims.height} 
          scale={scale}
        />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/5" />
      <LegendOverlay />
    </div>
  )
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  // head
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const size = 6 * (window.devicePixelRatio || 1)
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

function drawAngle(ctx: CanvasRenderingContext2D, x: number, y: number, vx_px: number, vy_px: number) {
  const theta = Math.atan2(Math.abs(vx_px), Math.abs(vy_px))
  const r = Math.min(28 * (window.devicePixelRatio || 1), Math.hypot(vx_px, vy_px))
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.lineWidth = 1
  ctx.arc(x, y, r, Math.PI / 2, Math.PI / 2 - theta, true)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = `${12 * (window.devicePixelRatio || 1)}px JetBrains Mono, Courier New, monospace`
  const deg = (theta * 180) / Math.PI
  ctx.fillText(`${deg.toFixed(1)}°`, x + 6, y - 6)
}

function LegendOverlay() {
  return (
    <div className="absolute top-2 left-2 text-xs text-white/70 bg-black/30 backdrop-blur px-2 py-1 rounded border border-white/10">
      <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan inline-block rounded" /> Vx (cian)</div>
      <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue inline-block rounded" /> Vy (azul)</div>
      <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green inline-block rounded" /> Vr (verde)</div>
    </div>
  )
}
