import type { StatsResult } from '@/types/matrix'

interface Props {
  stats: StatsResult
}

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n)
  return parseFloat(n.toFixed(10)).toString()
}

const CARDS = [
  { key: 'max' as const, label: 'Máximo' },
  { key: 'min' as const, label: 'Mínimo' },
  { key: 'sum' as const, label: 'Suma total' },
  { key: 'avg' as const, label: 'Promedio' },
]

export default function StatsPanel({ stats }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Estadísticas
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {CARDS.map(({ key, label }) => (
          <div key={key} className="bg-white border border-slate-200 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-semibold font-mono text-slate-800 truncate">
              {fmt(stats[key])}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 flex items-center gap-3 flex-wrap">
        <p className="text-xs text-slate-500 font-medium">Matriz diagonal</p>
        {(['Q', 'R'] as const).map((k) => (
          <span
            key={k}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              stats.isDiagonal[k]
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {k}: {stats.isDiagonal[k] ? 'Sí' : 'No'}
          </span>
        ))}
      </div>
    </div>
  )
}
