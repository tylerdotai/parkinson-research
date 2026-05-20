"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SubscribeClientProps {
  locale: string
  dictionary: {
    title: string
    subtitle: string
    placeholder: string
    button: string
    loading: string
    successTitle: string
    successDesc: string
    alreadyTitle: string
    alreadyDesc: string
    securityNote: string
  }
}

export function SubscribeClient({ locale, dictionary: t }: SubscribeClientProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const res = await fetch(`/${locale}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: locale }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setTimeout(() => router.push(`/${locale}/confirmed`), 2000)
      } else if (res.status === 409 || data.error === 'already_subscribed') {
        setStatus('already')
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
        setStatus('idle')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-lg text-center py-20">
        <div className="w-16 h-16 rounded-full bg-pap-success/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-pap-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-3xl text-pap-text mb-3">{t.successTitle}</h2>
        <p className="text-pap-muted">{t.successDesc.replace('{email}', email)}</p>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="mx-auto max-w-lg text-center py-20">
        <div className="w-16 h-16 rounded-full bg-pap-purple/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-pap-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-3xl text-pap-text mb-3">{t.alreadyTitle}</h2>
        <p className="text-pap-muted">{t.alreadyDesc}</p>
        <a
          href={`/${locale}`}
          className="inline-flex items-center gap-2 mt-6 text-sm text-pap-purple hover:underline"
        >
          ← Back to home
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg text-center py-20 px-5">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.1] tracking-tight text-pap-text mb-4">
        {t.title}
      </h1>
      <p className="text-pap-muted text-lg mb-8">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 px-5 py-3.5 rounded-full border border-pap-border bg-white text-pap-text placeholder-pap-dim focus:outline-none focus:border-pap-purple focus:ring-2 focus:ring-pap-purple/20 transition-all text-center sm:text-left"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3.5 rounded-full bg-pap-purple text-white font-medium hover:bg-pap-purple/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.loading}
              </>
            ) : (
              t.button
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </form>

      <div className="mt-6 flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-pap-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p className="text-sm text-pap-dim">{t.securityNote}</p>
      </div>

      <div className="mt-12 pt-12 border-t border-pap-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple mb-4">Why subscribe?</p>
        <div className="space-y-3 text-left max-w-sm mx-auto">
          {[
            'Daily breakthroughs in Parkinson&apos;s research',
            'Clinical trials recruiting near you',
            'Lifestyle interventions backed by evidence',
            'Written for families, not researchers',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <svg className="w-4 h-4 text-pap-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-pap-muted">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 rounded-2xl border border-pap-border" style={{ background: 'var(--pap-surface)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-lavender mb-3">From the founder</p>
        <p className="text-sm text-pap-muted italic">
          &quot;When my dad was diagnosed with Parkinson&apos;s, I wanted a way to keep up with all the latest breakthroughs without searching through dozens of medical websites. So I built this — for families like ours.&quot;
        </p>
        <p className="text-xs text-pap-dim mt-3">— Tyler Delano</p>
      </div>
    </div>
  )
}