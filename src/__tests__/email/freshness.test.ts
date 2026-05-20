import { isFresh } from '@/lib/sources'

describe('isFresh', () => {
  it('returns true for dates within 90 days', () => {
    const recent = new Date()
    recent.setDate(recent.getDate() - 30)
    expect(isFresh(recent.toISOString())).toBe(true)
  })

  it('returns true for today', () => {
    expect(isFresh(new Date().toISOString())).toBe(true)
  })

  it('returns false for dates older than 90 days', () => {
    const old = new Date()
    old.setDate(old.getDate() - 91)
    expect(isFresh(old.toISOString())).toBe(false)
  })

  it('returns true for dates at exactly 90 days', () => {
    const boundary = new Date()
    boundary.setDate(boundary.getDate() - 90)
    expect(isFresh(boundary.toISOString())).toBe(true)
  })

  it('handles invalid date strings gracefully', () => {
    expect(isFresh('invalid-date')).toBe(false)
    expect(isFresh('')).toBe(false)
  })
})