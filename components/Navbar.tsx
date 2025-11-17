'use client'

import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-base sm:text-lg font-semibold text-cyan hover:text-cyan/80 transition-colors whitespace-nowrap">
            Física Lluvia
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            <Link 
              href="/prototipo-fisico" 
              className="text-sm text-white/70 hover:text-white transition-colors whitespace-nowrap px-4 py-2 rounded hover:bg-white/5"
            >
              Prototipo físico
            </Link>
            <Link 
              href="/datos-reales" 
              className="text-sm text-white/70 hover:text-white transition-colors whitespace-nowrap px-4 py-2 rounded hover:bg-white/5"
            >
              Datos reales
            </Link>
            <Link 
              href="/formulas" 
              className="text-sm text-white/70 hover:text-white transition-colors whitespace-nowrap px-4 py-2 rounded hover:bg-white/5"
            >
              Fórmulas
            </Link>
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden flex items-center flex-1 justify-end gap-2">
            <Link 
              href="/prototipo-fisico" 
              className="text-xs text-white/70 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-white/5"
            >
              Prototipo
            </Link>
            <Link 
              href="/datos-reales" 
              className="text-xs text-white/70 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-white/5"
            >
              Datos
            </Link>
            <Link 
              href="/formulas" 
              className="text-xs text-white/70 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-white/5"
            >
              Fórmulas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
