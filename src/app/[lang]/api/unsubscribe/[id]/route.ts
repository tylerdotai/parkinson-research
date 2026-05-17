import { NextRequest, NextResponse } from 'next/server'
import { unsubscribe } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!id || !uuidRegex.test(id)) {
    return NextResponse.json({ error: 'Invalid unsubscribe token' }, { status: 400 })
  }

  const result = await unsubscribe(id)

  if (result.success) {
    return NextResponse.redirect(new URL(`/?unsubscribed=1`, req.url))
  }

  return NextResponse.json({ error: result.error || 'Unsubscribe failed' }, { status: 500 })
}
