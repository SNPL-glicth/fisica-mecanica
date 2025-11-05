'use client'

import React from 'react'

type Props = {
  visualMode: 'physics' | 'urban'
  onToggle: () => void
}

export default function ThemeToggle({ visualMode, onToggle }: Props) {
  return (
    <div className="flex flex-col items-end gap-2">
      <span className="text-xs text-white/60">Modo Visual</span>
      <button
        onClick={onToggle}
        className="relative inline-flex items-center h-8 rounded-full w-16 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:ring-offset-2 focus:ring-offset-black"
        style={{
          backgroundColor: visualMode === 'physics' ? '#0099ff' : '#00d9ff'
        }}
      >
        <span className="sr-only">Toggle visual mode</span>
        <span
          className={`${
            visualMode === 'urban' ? 'translate-x-9' : 'translate-x-1'
          } inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg`}
        />
      </button>
      <span className="text-xs text-cyan mono">
        {visualMode === 'physics' ? '🔬 Física' : '🏙️ Urbano'}
      </span>
    </div>
  )
}
