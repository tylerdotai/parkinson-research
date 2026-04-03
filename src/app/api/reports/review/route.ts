import { NextRequest } from 'next/server'
import { getReport, storeReportReview, updateReportReviewStatus, getReportReviews } from '@/lib/supabase'

const REVIEW_PROMPT = `You are a medical review agent evaluating a Parkinson's disease research report.
The report content is provided below.

Your task:
1. Score accuracy/medical soundness (1-10)
2. Flag any claims that are unsubstantiated, potentially misleading, or need verification
3. Identify any safety-sensitive claims (e.g. miracle cures, unproven treatments)
4. Write a brief clinical assessment

Return your review as JSON with this structure:
{
  "score": number (1-10),
  "findings": [{"severity": "low"|"medium"|"high", "category": string, "text": string}],
  "flagged_claims": [{"text": string, "concern": string}],
  "recommendation": "approve"|"flag"|"revision",
  "notes": string (brief clinical assessment)
}

Report content:
---
{content}
---

Respond ONLY with the JSON. No preamble.`

export async function POST(req: NextRequest) {
  try {
    const { date, language } = await req.json()

    if (!date || !language) {
      return Response.json({ error: 'Missing date or language' }, { status: 400 })
    }

    const report = await getReport(date, language)
    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 })
    }

    if (report.review_status !== 'pending') {
      return Response.json({ error: 'Report already reviewed', status: report.review_status }, { status: 409 })
    }

    // Call MiniMax to do the review
    const apiKey = process.env.MINIMAX_API_KEY || require('fs').readFileSync(require('os').homedir() + '/.minimax/token_plan_key', 'utf8').trim()
    if (!apiKey) {
      return Response.json({ error: 'MINIMAX_API_KEY not configured' }, { status: 500 })
    }

    const prompt = REVIEW_PROMPT.replace('{content}', report.content)

    const response = await fetch('https://api.minimax.io/v1/text/chatcompletion_pro', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      return Response.json({ error: 'Review LLM call failed' }, { status: 502 })
    }

    const data = await response.json()
    const rawText = data?.choices?.[0]?.message?.content || '{}'

    let reviewData
    try {
      reviewData = JSON.parse(rawText)
    } catch {
      return Response.json({ error: 'Failed to parse review JSON', raw: rawText }, { status: 500 })
    }

    // Store the review
    const storeResult = await storeReportReview({
      report_id: report.id,
      reviewer_role: 'clinical',
      score: reviewData.score || 5,
      findings: reviewData.findings || [],
      flagged_claims: reviewData.flagged_claims || [],
      recommendation: reviewData.recommendation || 'flag',
      notes: reviewData.notes || null,
    })

    if (!storeResult.success) {
      return Response.json({ error: 'Failed to store review', detail: storeResult.error }, { status: 500 })
    }

    // Determine overall status based on recommendation
    const rec = reviewData.recommendation || 'flag'
    const status = rec === 'approve' ? 'approved' : rec === 'revision' ? 'flagged' : 'flagged'
    await updateReportReviewStatus(report.id, status, reviewData.score || 5)

    return Response.json({
      success: true,
      review: {
        score: reviewData.score,
        recommendation: rec,
        findings_count: (reviewData.findings || []).length,
        flagged_claims_count: (reviewData.flagged_claims || []).length,
      }
    })
  } catch (err) {
    console.error('[review-report]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const language = searchParams.get('language') || 'en'

  if (!date) {
    return Response.json({ error: 'Missing date param' }, { status: 400 })
  }

  const report = await getReport(date, language)
  if (!report) {
    return Response.json({ error: 'Report not found' }, { status: 404 })
  }

  const reviews = await getReportReviews(report.id)
  return Response.json({ report, reviews })
}
