import { NextRequest, NextResponse } from 'next/server'
import { unsubscribe } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing unsubscribe token' }, { status: 400 })
  }

  const result = await unsubscribe(id)

  if (result.success) {
    return NextResponse.redirect(new URL(`/?unsubscribed=1`, request.url))
  }

  return NextResponse.json({ error: result.error || 'Unsubscribe failed' }, { status: 500 })
}
