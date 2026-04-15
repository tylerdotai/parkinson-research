const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gbzuvtzsezmfzgybryrs.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zB0PHZUbawooCQY0k1QRNQ__siDSybB'

export interface Subscriber {
  id: string
  email: string
  language: 'en' | 'es'
  subscribed_at: string
  confirmed_at: string | null
  unsubscribed_at: string | null
  source: string
}

export async function subscribe(email: string, language = 'en', source = 'website'): Promise<{ success: boolean; error?: string; alreadySubscribed?: boolean; id?: string }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      email,
      language,
      source,
      confirmed_at: null, // requires email verification
    }),
  })

  if (res.status === 201) {
    const data = await res.json()
    return { success: true, id: data[0]?.id }
  }

  if (res.status === 409) {
    return { success: false, error: 'already_subscribed', alreadySubscribed: true }
  }

  const errorText = await res.text()
  return { success: false, error: errorText }
}

export async function confirmSubscription(id: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      confirmed_at: new Date().toISOString(),
    }),
  })

  if (res.ok) {
    return { success: true }
  }

  const errorText = await res.text()
  return { success: false, error: errorText }
}

export async function unsubscribe(id: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      unsubscribed_at: new Date().toISOString(),
    }),
  })

  if (res.ok) {
    return { success: true }
  }

  const errorText = await res.text()
  return { success: false, error: errorText }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface Report {
  id: string
  date: string
  language: 'en' | 'es'
  title: string
  content: string
  sources: { name: string; url: string }[]
  category_counts: Record<string, number>
  generated_at: string
  reviewed_at: string | null
  review_status: 'pending' | 'approved' | 'flagged' | 'reviewed'
  review_score: number | null
}

export interface ReportReview {
  id: string
  report_id: string
  reviewer_role: 'clinical' | 'credibility' | 'accessibility'
  score: number
  findings: { severity: 'low' | 'medium' | 'high'; category: string; text: string }[]
  flagged_claims: { text: string; concern: string }[]
  recommendation: 'approve' | 'flag' | 'revision'
  notes: string | null
  reviewed_at: string
}

export async function storeReport(report: {
  date: string
  language: 'en' | 'es'
  title: string
  content: string
  sources?: { name: string; url: string }[]
  category_counts?: Record<string, number>
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const body = {
    date: report.date,
    language: report.language,
    title: report.title,
    content: report.content,
    sources: JSON.stringify(report.sources || []),
    category_counts: JSON.stringify(report.category_counts || {}),
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  })

  if (res.status === 201) {
    const data = await res.json()
    return { success: true, id: data[0]?.id }
  }

  if (res.status === 409) {
    // Already exists — update instead
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/reports?date=eq.${report.date}&language=eq.${report.language}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    return { success: patchRes.ok }
  }

  const errorText = await res.text()
  return { success: false, error: errorText }
}

export async function getReport(date: string, language: 'en' | 'es'): Promise<Report | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reports?date=eq.${date}&language=eq.${language}&select=*`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  )

  if (!res.ok) return null
  const data = await res.json()
  return data[0] || null
}

export async function storeReportReview(review: Omit<ReportReview, 'id' | 'reviewed_at'>): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/report_reviews`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      ...review,
      findings: JSON.stringify(review.findings),
      flagged_claims: JSON.stringify(review.flagged_claims),
    }),
  })

  if (res.status === 201) return { success: true }
  const errorText = await res.text()
  return { success: false, error: errorText }
}

export async function updateReportReviewStatus(
  reportId: string,
  status: 'approved' | 'flagged' | 'reviewed',
  score: number
): Promise<{ success: boolean }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      review_status: status,
      review_score: score,
      reviewed_at: new Date().toISOString(),
    }),
  })
  return { success: res.ok }
}

export async function getReportReviews(reportId: string): Promise<ReportReview[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/report_reviews?report_id=eq.${reportId}&select=*`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  )
  if (!res.ok) return []
  return await res.json()
}
