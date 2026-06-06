import { NextRequest, NextResponse } from 'next/server'

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const upstream = await fetch(`${GO_API_URL}/api/matrix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    })

    const data = await upstream.json()
    return NextResponse.json(data, { status: upstream.status })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError'
    return NextResponse.json(
      { error: isTimeout ? 'La API Go no respondió a tiempo' : 'Error al comunicarse con la API Go' },
      { status: 502 }
    )
  }
}
