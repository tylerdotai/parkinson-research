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
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>
          {t.successTitle}
        </h3>
        <p className="text-sm text-slate-500">
          {t.successDesc.replace('{email}', `<strong>${email}</strong>`)}
        </p>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="card text-center py-8">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>
          {t.alreadyTitle}
        </h3>
        <p className="text-sm text-slate-500">
          {t.alreadyDesc}
        </p>
      </div>
    )
  }

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-1" style={{ fontFamily: 'Instrument Serif, serif' }}>
            {t.title}
          </h3>
          <p className="text-sm text-slate-600">
            {t.subtitle}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            className="flex-1 md:w-64 px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn btn-primary whitespace-nowrap disabled:opacity-50"
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
        <p className="text-xs text-red-500 mt-3">{errorMsg}</p>
      )}
    </div>
  )
}
