import { NextRequest } from 'next/server'
import { storeReport } from '@/lib/supabase'
import { Logger } from '@/lib/logger'

// This endpoint is called by the cron script on Hoss to store generated reports.
// The cron script also stores directly via Supabase REST as a fallback.
// POST body: { date, language, title, content, sources, category_counts }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, language, title, content, sources, category_counts } = body

    if (!date || !language || !content) {
      return Response.json({ error: 'Missing required fields: date, language, content' }, { status: 400 })
    }

    if (!['en', 'es'].includes(language)) {
      return Response.json({ error: 'Invalid language' }, { status: 400 })
    }

    const result = await storeReport({ date, language, title, content, sources, category_counts })

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, id: result.id })
  } catch (err) {
    Logger.error('store-report', 'Failed to store report', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
