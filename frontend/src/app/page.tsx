'use client'

import MatrixForm from '@/components/MatrixForm'
import ResultsSection from '@/components/ResultsSection'
import { useMatrixProcessor } from '@/hooks/useMatrixProcessor'

export default function Home() {
  const { data, error, isLoading, process } = useMatrixProcessor()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
          <div>
            <p className="text-sm font-semibold leading-none">Interseguro</p>
            <p className="text-xs text-slate-400 mt-0.5">QR Matrix Factorization — Coding Challenge</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">

          {/* Panel izquierdo — formulario */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-8">
            <h2 className="text-sm font-semibold text-slate-800 mb-5">Entrada</h2>
            <MatrixForm onSubmit={process} isLoading={isLoading} />

            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingresa una matriz rectangular (filas ≥ columnas) en formato JSON.
                La API calcula la factorización QR y estadísticas sobre las matrices resultantes.
              </p>
            </div>
          </div>

          {/* Panel derecho — resultados */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-5">Resultados</h2>

            {!data && !error && !isLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-xl">
                  ∅
                </div>
                <p className="text-sm text-slate-400">
                  Ingresa una matriz y presiona{' '}
                  <span className="font-medium text-slate-500">Procesar</span>
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm text-slate-400">Calculando factorización QR...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-semibold text-red-700 mb-1">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {data && !isLoading && <ResultsSection response={data} />}
          </div>

        </div>
      </main>
    </div>
  )
}
