// Freshness filter (90 days cutoff)
export const FRESHNESS_DAYS = 90

export function isFresh(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diff < FRESHNESS_DAYS
}

export async function searchPubMed(query: string): Promise<string> {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}+parkinson+disease&retmax=10&retmode=json&sort=relevance&datetype=pdat`
    const searchRes = await fetch(searchUrl)
    if (!searchRes.ok) return ''
    const searchData = await searchRes.json() as { esearchresult?: { idlist?: string[] } }
    const ids = searchData.esearchresult?.idlist ?? []
    if (ids.length === 0) return ''

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
    const fetchRes = await fetch(fetchUrl)
    if (!fetchRes.ok) return ''
    const fetchData = await fetchRes.json() as { result?: Record<string, { title?: string; source?: string; pubdate?: string; url?: string; authors?: Array<{ name: string }> }> }

    const results: string[] = []
    for (const id of ids.slice(0, 5)) {
      const article = fetchData.result?.[id]
      if (!article) continue
      const pubDate = article.pubdate ?? ''
      if (pubDate && !isFresh(pubDate)) continue
      const authors = (article.authors ?? []).slice(0, 3).map((a) => a.name).join(', ')
      results.push(`[PubMed:${id}] ${article.title ?? ''} (${pubDate}) — ${authors}`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}

export async function searchGP2(query: string): Promise<string> {
  try {
    const url = `https://gp2.org/search?query=${encodeURIComponent(query + ' parkinson')}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return ''
    const data = await res.json() as { results?: Array<{ title?: string; date?: string; url?: string; description?: string }> }
    const results: string[] = []
    for (const item of (data.results ?? []).slice(0, 5)) {
      if (item.date && !isFresh(item.date)) continue
      results.push(`[GP2] ${item.title ?? ''} — ${item.description ?? ''} (${item.url ?? ''})`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}

export async function searchAMPPD(query: string): Promise<string> {
  try {
    const url = `https://amp-pd.org/api/search?q=${encodeURIComponent(query + ' parkinson')}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return ''
    const data = await res.json() as { items?: Array<{ title?: string; date?: string; link?: string; summary?: string }> }
    const results: string[] = []
    for (const item of (data.items ?? []).slice(0, 5)) {
      if (item.date && !isFresh(item.date)) continue
      results.push(`[AMP PD] ${item.title ?? ''} — ${item.summary ?? ''} (${item.link ?? ''})`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}

export async function searchPPMI(query: string): Promise<string> {
  try {
    const url = `https://www.ppmi-info.org/api/search?q=${encodeURIComponent(query + ' parkinson')}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return ''
    const data = await res.json() as { results?: Array<{ title?: string; date?: string; url?: string; summary?: string }> }
    const results: string[] = []
    for (const item of (data.results ?? []).slice(0, 5)) {
      if (item.date && !isFresh(item.date)) continue
      results.push(`[PPMI] ${item.title ?? ''} — ${item.summary ?? ''} (${item.url ?? ''})`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}