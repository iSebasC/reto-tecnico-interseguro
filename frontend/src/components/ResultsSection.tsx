import type { ProcessResponse } from '@/types/matrix'
import MatrixTable from './MatrixTable'
import StatsPanel from './StatsPanel'

interface Props {
  response: ProcessResponse
}

export default function ResultsSection({ response }: Props) {
  const { original, qr, stats } = response

  return (
    <div className="flex flex-col gap-6">
      <MatrixTable matrix={original} label="Matriz original" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MatrixTable matrix={qr.Q} label="Matriz Q" />
        <MatrixTable matrix={qr.R} label="Matriz R" />
      </div>

      <StatsPanel stats={stats} />
    </div>
  )
}
