import type { Matrix } from '@/types/matrix'

interface Props {
  matrix: Matrix
  label: string
  className?: string
}

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n)
  return parseFloat(n.toFixed(10)).toString()
}

export default function MatrixTable({ matrix, label, className = '' }: Props) {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0

  return (
    <div className={className}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
        <span className="ml-2 font-normal text-slate-400 normal-case">
          {rows}×{cols}
        </span>
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="text-xs font-mono w-full">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                {row.map((val, j) => (
                  <td
                    key={j}
                    className="px-3 py-1.5 text-right text-slate-700 whitespace-nowrap border-r border-slate-100 last:border-0"
                  >
                    {fmt(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
