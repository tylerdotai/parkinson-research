export interface ReportEntry {
  title: string
  snippet: string
  date?: string
  source?: string
  url?: string
}

export interface ReportSection {
  title: string
  emoji: string
  category: 'clinical' | 'breakthrough' | 'lifestyle' | 'emerging' | 'tech' | 'community' | 'caregiver'
  entries: ReportEntry[]
}
