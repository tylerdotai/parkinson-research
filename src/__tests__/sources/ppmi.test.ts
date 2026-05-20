import { searchPPMI } from '@/lib/sources'

global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

function createMockResponse(body: unknown): Response {
  return {
    ok: true,
    json: async () => body,
  } as unknown as Response
}

function createErrorResponse(status: number): Response {
  return {
    ok: false,
    status,
  } as unknown as Response
}

describe('searchPPMI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns formatted results when API returns recent data', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({
      results: [
        {
          title: 'PPMI Imaging Findings',
          date: '2026-04-20',
          url: 'https://www.ppmi-info.org/study/789',
          summary: 'New imaging biomarkers from PPMI cohort',
        },
      ],
    }))

    const result = await searchPPMI('imaging')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.ppmi-info.org/api/search?q=imaging%20parkinson',
      { headers: { Accept: 'application/json' } }
    )
    expect(result).toContain('[PPMI]')
    expect(result).toContain('PPMI Imaging Findings')
    expect(result).toContain('New imaging biomarkers from PPMI cohort')
    expect(result).toContain('https://www.ppmi-info.org/study/789')
  })

  it('returns empty string when no results', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ results: [] }))

    const result = await searchPPMI('nonexistent')

    expect(result).toBe('')
  })

  it('returns empty string when API fails', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(500))

    const result = await searchPPMI('test')

    expect(result).toBe('')
  })

  it('returns empty string on malformed response', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ results: undefined }))

    const result = await searchPPMI('test')

    expect(result).toBe('')
  })

  it('returns empty string when rate limited', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(429))

    const result = await searchPPMI('test')

    expect(result).toBe('')
  })

  it('filters out items older than 90 days', async () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 100)
    const oldDateStr = oldDate.toISOString().split('T')[0]

    mockFetch.mockResolvedValueOnce(createMockResponse({
      results: [
        {
          title: 'Old PPMI data',
          date: oldDateStr,
          url: 'https://www.ppmi-info.org/old',
          summary: 'Stale data',
        },
      ],
    }))

    const result = await searchPPMI('test')

    expect(result).toBe('')
  })
})