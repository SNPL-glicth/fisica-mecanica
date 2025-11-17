import fs from 'fs/promises'
import path from 'path'

export type RainRecord = {
  fecha: string
  precipitacion_mm: number
  fuente: string
}

// Coordenadas de ejemplo: Engativá, Bogotá. Ajusta a tu localidad si quieres.
const DEFAULT_LAT = 4.72
const DEFAULT_LON = -74.09

// Descarga datos diarios de precipitación de Open-Meteo y los guarda en public/datos/lluvia.json
export async function updateRainDataFromOpenMeteo(
  {
    latitude = DEFAULT_LAT,
    longitude = DEFAULT_LON,
    startDate,
    endDate,
  }: { latitude?: number; longitude?: number; startDate?: string; endDate?: string } = {}
) {
  const today = new Date()
  const isoToday = today.toISOString().slice(0, 10)

  // Por defecto: últimos 3 meses
  const startDefault = new Date(today)
  startDefault.setMonth(startDefault.getMonth() - 3)
  const isoStartDefault = startDefault.toISOString().slice(0, 10)

  const start = startDate ?? isoStartDefault
  const end = endDate ?? isoToday

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', 'precipitation_sum')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('start_date', start)
  url.searchParams.set('end_date', end)

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP ${res.status}`)
  }

  const json = await res.json() as any

  const dates: string[] = json?.daily?.time ?? []
  const values: number[] = json?.daily?.precipitation_sum ?? []

  if (!dates.length || !values.length) {
    throw new Error('Respuesta de Open-Meteo sin datos diarios')
  }

  const records: RainRecord[] = dates.map((d, i) => ({
    fecha: d,
    precipitacion_mm: Number(values[i] ?? 0),
    fuente: 'Open-Meteo (auto)'
  }))

  // Guardar en public/datos/lluvia.json
  const filePath = path.join(process.cwd(), 'public', 'datos', 'lluvia.json')
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf8')

  return records
}
