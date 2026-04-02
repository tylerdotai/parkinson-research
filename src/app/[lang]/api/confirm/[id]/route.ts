import { NextRequest, NextResponse } from 'next/server'
import { confirmSubscription } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string; id: string }> }
) {
  const { lang, id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing confirmation token' }, { status: 400 })
  }

  const result = await confirmSubscription(id)

  if (result.success) {
    return NextResponse.redirect(new URL(`/${lang}/confirmed`, request.url))
  }

  return NextResponse.json({ error: result.error || 'Confirmation failed' }, { status: 500 })
}
