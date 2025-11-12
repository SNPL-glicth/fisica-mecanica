// Fetch precipitación diaria (mm) para Engativá (Bogotá) y guarda en public/datos/lluvia.json
// Fuente: Open-Meteo Archive API

import fs from 'node:fs/promises'

// Aproximación del centro de Engativá
const LAT = 4.72
const LON = -74.11

function fmt(d) {
  return d.toISOString().slice(0, 10)
}

async function main() {
  const today = new Date()
  const end = fmt(today)
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 60)
  const start = fmt(startDate)

  const url = new URL('https://archive-api.open-meteo.com/v1/archive')
  url.searchParams.set('latitude', String(LAT))
  url.searchParams.set('longitude', String(LON))
  url.searchParams.set('daily', 'precipitation_sum')
  url.searchParams.set('start_date', start)
  url.searchParams.set('end_date', end)
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} al consultar Open-Meteo`)
  }
  const json = await res.json()
  const times = json?.daily?.time || []
  const precs = json?.daily?.precipitation_sum || []

  const rows = times.map((t, i) => ({
    fecha: t,
    precipitacion_mm: Number(precs[i] ?? 0),
    fuente: 'Open-Meteo (Engativá aprox)'
  }))

  // Asegurar carpeta
  await fs.mkdir('public/datos', { recursive: true })
  await fs.writeFile('public/datos/lluvia.json', JSON.stringify(rows, null, 2), 'utf8')
  console.log(`Escrito public/datos/lluvia.json con ${rows.length} registros (${start}..${end})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
