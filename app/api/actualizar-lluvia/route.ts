import { NextResponse } from 'next/server'
import { updateRainDataFromOpenMeteo } from '@/lib/openMeteo'

export async function POST() {
  try {
    const records = await updateRainDataFromOpenMeteo()
    return NextResponse.json({ ok: true, registros: records.length })
  } catch (error: any) {
    console.error('Error actualizando datos de lluvia:', error)
    return NextResponse.json({ ok: false, error: error?.message ?? 'Error desconocido' }, { status: 500 })
  }
}
