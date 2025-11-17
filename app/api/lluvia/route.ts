import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { updateRainDataFromOpenMeteo } from '@/lib/openMeteo'
import type { RainRecord } from '@/lib/useRainData'

const DATA_PATH = path.join(process.cwd(), 'public', 'datos', 'lluvia.json')

async function readLocalFile(): Promise<RainRecord[] | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    const json = JSON.parse(raw) as any[]
    return json.map((r) => ({
      date: r.fecha,
      precipitation: Number(r.precipitacion_mm ?? 0),
      source: r.fuente,
    }))
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const local = await readLocalFile()
    if (local && local.length) {
      return NextResponse.json(local)
    }

    // Si no hay archivo local, actualizar desde Open-Meteo
    const apiRecords = await updateRainDataFromOpenMeteo()
    const mapped: RainRecord[] = apiRecords.map((r) => ({
      date: r.fecha,
      precipitation: r.precipitacion_mm,
      source: r.fuente,
    }))
    return NextResponse.json(mapped)
  } catch (error: any) {
    console.error('Error en GET /api/lluvia', error)
    return NextResponse.json(
      { error: error?.message ?? 'Error obteniendo datos de lluvia' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const refresh = url.searchParams.get('refresh') === '1'

    if (!refresh) {
      return NextResponse.json({ ok: false, error: 'Usa ?refresh=1 para actualizar' }, { status: 400 })
    }

    const apiRecords = await updateRainDataFromOpenMeteo()
    const mapped: RainRecord[] = apiRecords.map((r) => ({
      date: r.fecha,
      precipitation: r.precipitacion_mm,
      source: r.fuente,
    }))

    return NextResponse.json({ ok: true, registros: mapped.length })
  } catch (error: any) {
    console.error('Error en POST /api/lluvia', error)
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Error actualizando datos de lluvia' },
      { status: 500 }
    )
  }
}
