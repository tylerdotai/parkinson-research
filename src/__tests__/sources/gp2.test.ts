import { searchGP2 } from '@/lib/sources'

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

describe('searchGP2', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns formatted results when API returns recent data', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({
      results: [
        {
          title: 'GP2 Study Results',
          date: '2026-04-15',
          url: 'https://gp2.org/study/123',
          description: 'Important findings from GP2 consortium',
        },
      ],
    }))

    const result = await searchGP2('exercise')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://gp2.org/search?query=exercise%20parkinson',
      { headers: { Accept: 'application/json' } }
    )
    expect(result).toContain('[GP2]')
    expect(result).toContain('GP2 Study Results')
    expect(result).toContain('Important findings from GP2 consortium')
    expect(result).toContain('https://gp2.org/study/123')
  })

  it('returns empty string when no results', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ results: [] }))

    const result = await searchGP2('nonexistent')

    expect(result).toBe('')
  })

  it('returns empty string when API fails', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(500))

    const result = await searchGP2('test')

    expect(result).toBe('')
  })

  it('returns empty string on malformed response', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ results: undefined }))

    const result = await searchGP2('test')

    expect(result).toBe('')
  })

  it('returns empty string when rate limited', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(429))

    const result = await searchGP2('test')

    expect(result).toBe('')
  })

  it('filters out items older than 90 days', async () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 100)
    const oldDateStr = oldDate.toISOString().split('T')[0]

    mockFetch.mockResolvedValueOnce(createMockResponse({
      results: [
        {
          title: 'Old GP2 study',
          date: oldDateStr,
          url: 'https://gp2.org/old',
          description: 'This is old data',
        },
      ],
    }))

    const result = await searchGP2('test')

    expect(result).toBe('')
  })
})