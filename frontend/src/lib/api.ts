import type { ProcessResponse } from '@/types/matrix'

const TIMEOUT_MS = 10_000

export async function processMatrix(matrix: number[][]): Promise<ProcessResponse> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch('/api/matrix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matrix }),
      signal: controller.signal,
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error ?? `Error del servidor (HTTP ${res.status})`)
    }

    return data as ProcessResponse
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Intenta con una matriz más pequeña.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
