'use client'

import { useState } from 'react'
import type { Matrix } from '@/types/matrix'

const EXAMPLE: Matrix = [
  [12, -51, 4],
  [6, 167, -68],
  [-4, 24, -41],
]

interface Props {
  onSubmit: (matrix: Matrix) => void
  isLoading: boolean
}

export default function MatrixForm({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function loadExample() {
    setValue(JSON.stringify(EXAMPLE, null, 2))
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    let parsed: unknown
    try {
      parsed = JSON.parse(value.trim())
    } catch {
      setError('JSON inválido. Ejemplo: [[1,2],[3,4],[5,6]]')
      return
    }

    if (!Array.isArray(parsed) || parsed.length === 0 || !Array.isArray(parsed[0])) {
      setError('Debe ser un array de arrays numéricos. Ejemplo: [[1,2],[3,4]]')
      return
    }

    onSubmit(parsed as Matrix)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Matriz <span className="font-normal normal-case text-slate-400">(formato JSON)</span>
        </label>
        <textarea
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null) }}
          rows={10}
          spellCheck={false}
          placeholder={'[[12,-51,4],\n [6,167,-68],\n [-4,24,-41]]'}
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-60"
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={loadExample}
          disabled={isLoading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Cargar ejemplo
        </button>
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            'Procesar →'
          )}
        </button>
      </div>
    </form>
  )
}
