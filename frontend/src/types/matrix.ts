export type Matrix = number[][]

export interface QRResult {
  Q: Matrix
  R: Matrix
}

export interface DiagonalCheck {
  Q: boolean
  R: boolean
}

export interface StatsResult {
  max: number
  min: number
  sum: number
  avg: number
  isDiagonal: DiagonalCheck
}

export interface ProcessResponse {
  original: Matrix
  qr: QRResult
  stats: StatsResult
}

export interface ApiError {
  error: string
  details?: string[]
}
