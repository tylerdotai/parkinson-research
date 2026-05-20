import { searchAMPPD } from '@/lib/sources'

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

describe('searchAMPPD', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns formatted results when API returns recent data', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({
      items: [
        {
          title: 'AMP PD Biomarker Study',
          date: '2026-05-01',
          link: 'https://amp-pd.org/study/456',
          summary: 'Novel biomarkers identified in AMP PD cohort',
        },
      ],
    }))

    const result = await searchAMPPD('biomarker')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://amp-pd.org/api/search?q=biomarker%20parkinson',
      { headers: { Accept: 'application/json' } }
    )
    expect(result).toContain('[AMP PD]')
    expect(result).toContain('AMP PD Biomarker Study')
    expect(result).toContain('Novel biomarkers identified in AMP PD cohort')
    expect(result).toContain('https://amp-pd.org/study/456')
  })

  it('returns empty string when no results', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ items: [] }))

    const result = await searchAMPPD('nonexistent')

    expect(result).toBe('')
  })

  it('returns empty string when API fails', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(500))

    const result = await searchAMPPD('test')

    expect(result).toBe('')
  })

  it('returns empty string on malformed response', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ items: undefined }))

    const result = await searchAMPPD('test')

    expect(result).toBe('')
  })

  it('returns empty string when rate limited', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(429))

    const result = await searchAMPPD('test')

    expect(result).toBe('')
  })

  it('filters out items older than 90 days', async () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 100)
    const oldDateStr = oldDate.toISOString().split('T')[0]

    mockFetch.mockResolvedValueOnce(createMockResponse({
      items: [
        {
          title: 'Old AMP PD data',
          date: oldDateStr,
          link: 'https://amp-pd.org/old',
          summary: 'Stale data',
        },
      ],
    }))

    const result = await searchAMPPD('test')

    expect(result).toBe('')
  })
})