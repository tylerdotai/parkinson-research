import { getAllReportDates, getReport, getReportMetadata } from '@/lib/reports'
import fs from 'fs'
import path from 'path'

describe('Reports', () => {
  const REPORTS_DIR = path.join(process.cwd(), 'public', 'reports')
  
  it('should have reports directory', () => {
    expect(fs.existsSync(REPORTS_DIR)).toBe(true)
  })

  it('should return report dates sorted in descending order', async () => {
    const dates = await getAllReportDates()
    expect(Array.isArray(dates)).toBe(true)
    expect(dates.length).toBeGreaterThan(0)
    
    // Check descending order
    for (let i = 1; i < dates.length; i++) {
      expect(new Date(dates[i-1]).getTime()).toBeGreaterThanOrEqual(new Date(dates[i]).getTime())
    }
  })

  it('should get report metadata', () => {
    const meta = getReportMetadata('2026-03-31')
    expect(meta).not.toBeNull()
    expect(meta).toHaveProperty('preview')
    expect(typeof meta!.preview).toBe('string')
    expect(meta!.preview.length).toBeLessThan(200)
  })

  it('should return null for non-existent report', () => {
    const meta = getReportMetadata('2020-01-01')
    expect(meta).toBeNull()
  })

  it('should get report content', async () => {
    const report = await getReport('2026-03-31')
    expect(report).not.toBeNull()
    expect(report).toHaveProperty('title')
    expect(report).toHaveProperty('date')
    expect(report).toHaveProperty('content')
    expect(report).toHaveProperty('html')
    expect(report).toHaveProperty('preview')
    expect(report!.date).toBe('2026-03-31')
  })

  it('should return null for non-existent report', async () => {
    const report = await getReport('2020-01-01')
    expect(report).toBeNull()
  })

  it('should have valid HTML content', async () => {
    const report = await getReport('2026-03-31')
    expect(report!.html).toContain('<h2')
    expect(report!.html).toContain('<p')
    expect(report!.html).not.toContain('🙂') // Emojis stripped
    expect(report!.html).not.toContain('🧠')
  })

  it('should strip emojis from report content', async () => {
    const report = await getReport('2026-03-31')
    // Check that common emojis are not in the HTML
    const emojis = ['🙂', '🧠', '💊', '🏃', '🔬', '🤝', '👨', '📚', '🎯']
    for (const emoji of emojis) {
      expect(report!.html).not.toContain(emoji)
    }
  })

  it('should have preview that is truncated', async () => {
    const report = await getReport('2026-03-31')
    expect(report!.preview.endsWith('...')).toBe(true)
    expect(report!.preview.length).toBeLessThanOrEqual(220)
  })
})
