import { NextRequest, NextResponse } from 'next/server'
import { confirmSubscription } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing confirmation token' }, { status: 400 })
  }

  const result = await confirmSubscription(id)

  if (result.success) {
    return NextResponse.redirect(new URL(`/?subscribed=1`, request.url))
  }

  return NextResponse.json({ error: result.error || 'Confirmation failed' }, { status: 500 })
}
