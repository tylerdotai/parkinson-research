'use client'

import { useState } from 'react'

type Props = {
  lang?: string
  dictionary?: {
    title: string
    subtitle: string
    placeholder: string
    button: string
    loading: string
    successTitle: string
    successDesc: string
    alreadyTitle: string
    alreadyDesc: string
  }
}

export default function SubscribeForm({ lang = 'en', dictionary }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const t = dictionary || {
    title: 'Get daily reports by email',
    subtitle: 'Free. No spam. Unsubscribe anytime. Powered by AI research agents.',
    placeholder: 'you@example.com',
    button: 'Subscribe',
    loading: 'Subscribing...',
    successTitle: 'Check your inbox!',
    successDesc: 'We sent a confirmation link to {email}. Click it to start receiving daily reports.',
    alreadyTitle: 'Already subscribed',
    alreadyDesc: "This email is already on the list. You'll receive tomorrow's report automatically.",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      })
      const data = await res.json()

      if (res.status === 409) {
        setStatus('already')
      } else if (res.ok) {
        setStatus('success')
      } else {
        setErrorMsg(data.error || 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error — please try again')
    }
  }

  if (status === 'success') {
    return (
      <div className="card text-center py-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(203, 183, 251, 0.15)' }}>
          <svg className="w-6 h-6" style={{ color: 'var(--color-amethyst)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}>
          {t.successTitle}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {t.successDesc.replace('{email}', `<strong>${email}</strong>`)}
        </p>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="card text-center py-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(203, 183, 251, 0.15)' }}>
          <svg className="w-6 h-6" style={{ color: 'var(--color-amethyst)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}>
          {t.alreadyTitle}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {t.alreadyDesc}
        </p>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '2rem 2.25rem' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1 min-w-0">
          <h3
            className="mb-2"
            style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.1875rem', fontWeight: 400, color: 'var(--color-charcoal)' }}
          >
            {t.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.subtitle}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-3 flex-shrink-0">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            style={{ width: '220px', fontSize: '0.9375rem', padding: '0.75rem 1.125rem' }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary whitespace-nowrap disabled:opacity-50 flex-shrink-0"
            style={{ fontSize: '0.9375rem', padding: '0.75rem 1.75rem' }}
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.loading}
              </span>
            ) : t.button}
          </button>
        </form>
      </div>
      {status === 'error' && (
        <p className="text-xs mt-4" style={{ color: '#b91c1c' }}>{errorMsg}</p>
      )}
      <p className="text-xs mt-4 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h8.25a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        No account required. Free forever.
      </p>
    </div>
  )
}
