import { NextRequest, NextResponse } from 'next/server'
import { subscribe } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email: string = body?.email?.trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const result = await subscribe(email.toLowerCase(), body?.source || 'website')

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Check your inbox to confirm your subscription.'
      })
    }

    if (result.alreadySubscribed) {
      return NextResponse.json({
        error: 'already_subscribed',
        message: 'This email is already subscribed.'
      }, { status: 409 })
    }

    return NextResponse.json({ error: result.error || 'Subscription failed' }, { status: 500 })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
