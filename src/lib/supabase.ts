const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gbzuvtzsezmfzgybryrs.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zB0PHZUbawooCQY0k1QRNQ__siDSybB'

export interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  confirmed_at: string | null
  unsubscribed_at: string | null
  source: string
}

export async function subscribe(email: string, source = 'website'): Promise<{ success: boolean; error?: string; alreadySubscribed?: boolean; id?: string }> {
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

export async function getActiveSubscribers(): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/subscribers?confirmed_at=not.is.null&unsubscribed_at=is.null&select=email`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  )

  if (!res.ok) return []
  const data = await res.json()
  return data.map((s: Subscriber) => s.email)
}
