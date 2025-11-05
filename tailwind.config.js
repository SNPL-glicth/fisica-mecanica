/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1a1a1a',
        cyan: '#00d9ff',
        blue: '#0099ff',
        green: '#00ff88',
        border: '#0b2a33'
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,217,255,0.3), 0 0 20px rgba(0,153,255,0.15)'
      }
    }
  },
  plugins: []
}
