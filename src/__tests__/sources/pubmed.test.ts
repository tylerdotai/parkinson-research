import { searchPubMed } from '@/lib/sources'

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

describe('searchPubMed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns formatted results when API returns recent articles', async () => {
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 30)
    const recentDateStr = recentDate.toISOString().split('T')[0]

    mockFetch
      .mockResolvedValueOnce(createMockResponse({ esearchresult: { idlist: ['12345', '67890'] } }))
      .mockResolvedValueOnce(createMockResponse({
        result: {
          '12345': {
            title: 'Alpha-synuclein and Parkinsons disease',
            source: 'PubMed',
            pubdate: recentDateStr,
            authors: [{ name: 'Smith J' }, { name: 'Doe A' }],
          },
          '67890': {
            title: 'Exercise and motor symptoms',
            source: 'PubMed',
            pubdate: recentDateStr,
            authors: [{ name: 'Brown K' }],
          },
        },
      }))

    const result = await searchPubMed('exercise')

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result).toContain('[PubMed:12345]')
    expect(result).toContain('Alpha-synuclein and Parkinsons disease')
    expect(result).toContain('Smith J, Doe A')
  })

  it('returns empty string when no results found', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({ esearchresult: { idlist: [] } }))

    const result = await searchPubMed('nonexistent query')

    expect(result).toBe('')
  })

  it('returns empty string when search API fails', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(500))

    const result = await searchPubMed('test')

    expect(result).toBe('')
  })

  it('returns empty string when fetch API fails', async () => {
    mockFetch
      .mockResolvedValueOnce(createMockResponse({ esearchresult: { idlist: ['12345'] } }))
      .mockResolvedValueOnce(createErrorResponse(500))

    const result = await searchPubMed('test')

    expect(result).toBe('')
  })

  it('returns empty string on malformed response', async () => {
    mockFetch
      .mockResolvedValueOnce(createMockResponse({ esearchresult: { idlist: ['12345'] } }))
      .mockResolvedValueOnce(createMockResponse({ result: undefined }))

    const result = await searchPubMed('test')

    expect(result).toBe('')
  })

  it('returns empty string when rate limited', async () => {
    mockFetch.mockResolvedValueOnce(createErrorResponse(429))

    const result = await searchPubMed('test')

    expect(result).toBe('')
  })

  it('filters out articles older than 90 days', async () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 100)
    const oldDateStr = oldDate.toISOString().split('T')[0]

    mockFetch
      .mockResolvedValueOnce(createMockResponse({ esearchresult: { idlist: ['12345'] } }))
      .mockResolvedValueOnce(createMockResponse({
        result: {
          '12345': {
            title: 'Old research article',
            source: 'PubMed',
            pubdate: oldDateStr,
            authors: [{ name: 'Smith J' }],
          },
        },
      }))

    const result = await searchPubMed('test')

    expect(result).toBe('')
  })
})