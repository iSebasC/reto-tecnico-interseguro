import { useState, useCallback } from 'react'
import { processMatrix } from '@/lib/api'
import type { Matrix, ProcessResponse } from '@/types/matrix'

interface State {
  data: ProcessResponse | null
  error: string | null
  isLoading: boolean
}

export function useMatrixProcessor() {
  const [state, setState] = useState<State>({
    data: null,
    error: null,
    isLoading: false,
  })

  const process = useCallback(async (matrix: Matrix) => {
    setState({ data: null, error: null, isLoading: true })
    try {
      const data = await processMatrix(matrix)
      setState({ data, error: null, isLoading: false })
    } catch (err) {
      setState({
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido',
        isLoading: false,
      })
    }
  }, [])

  return { ...state, process }
}
