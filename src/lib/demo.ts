export type SeasonRow = {
  rank: number
  org: string
  country: string
  headcount: number
  co2e: number
  quality: number
}

export function fairScore(row: Pick<SeasonRow, 'co2e' | 'headcount' | 'quality'>) {
  const perHead = row.co2e / Math.max(1, row.headcount)
  return Number((perHead * row.quality).toFixed(1))
}

export const demoSeasonRows: SeasonRow[] = [
  { rank: 1, org: 'Northside Branch', country: 'US', headcount: 15, co2e: 123, quality: 1.0 },
  { rank: 2, org: 'Riverside', country: 'GB', headcount: 9, co2e: 80, quality: 1.2 },
  { rank: 3, org: 'Central', country: 'DE', headcount: 18, co2e: 140, quality: 1.0 },
]




