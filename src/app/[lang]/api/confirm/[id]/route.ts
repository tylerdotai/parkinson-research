import { NextRequest, NextResponse } from 'next/server'
import { confirmSubscription } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lang: string; id: string }> }
) {
  const { lang, id } = await params

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!id || !uuidRegex.test(id)) {
    return NextResponse.json({ error: 'Invalid confirmation token' }, { status: 400 })
  }

  const result = await confirmSubscription(id)

  if (result.success) {
    return NextResponse.redirect(new URL(`/${lang}/confirmed`, req.url))
  }

  return NextResponse.json({ error: result.error || 'Confirmation failed' }, { status: 500 })
}
