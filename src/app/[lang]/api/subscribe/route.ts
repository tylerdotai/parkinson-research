import { NextRequest, NextResponse } from 'next/server'
import { subscribe } from '@/lib/supabase'
import { Resend } from 'resend'
import { Logger } from '@/lib/logger'

const getResend = () => new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email: string = body?.email?.trim()
    const lang: string = body?.lang === 'es' ? 'es' : 'en'

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const result = await subscribe(email.toLowerCase(), lang, body?.source || 'website')

    if (result.success && result.id) {
      const confirmUrl = `https://aiagainstparkinson.com/${lang}/api/confirm/${result.id}`

      const resendApiKey = process.env.RESEND_API_KEY
      if (resendApiKey) {
        try {
          await getResend().emails.send({
            from: 'AI Against Parkinson <research@clawplex.dev>',
            to: email,
            subject: lang === 'es'
              ? 'Confirma tu suscripcion a IA Contra el Parkinson'
              : 'Confirm your AI Against Parkinson subscription',
            html: lang === 'es' ? buildSpanishConfirmEmail(confirmUrl) : buildEnglishConfirmEmail(confirmUrl),
            text: lang === 'es'
              ? `Confirma tu suscripcion:\n\n${confirmUrl}\n\nUna vez confirmado, recibiras informes diarios de investigacion.`
              : `Confirm your subscription:\n\n${confirmUrl}\n\nOnce confirmed, you'll receive daily research reports.`,
          })
        } catch (emailErr) {
          Logger.error('subscribe', 'Failed to send confirmation email', emailErr)
        }
      }

      return NextResponse.json({
        success: true,
        message: lang === 'es'
          ? 'Revisa tu correo para confirmar tu suscripcion.'
          : 'Check your inbox to confirm your subscription.'
      })
    }

    if (result.alreadySubscribed) {
      return NextResponse.json({
        error: 'already_subscribed',
        message: lang === 'es'
          ? 'Este correo ya esta suscrito.'
          : 'This email is already subscribed.'
      }, { status: 409 })
    }

    return NextResponse.json({ error: result.error || 'Subscription failed' }, { status: 500 })
  } catch (err) {
    Logger.error('subscribe', 'Request failed', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function buildEnglishConfirmEmail(confirmUrl: string): string {
  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 24px 28px; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">AI Against Parkinson's</h1>
    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Daily AI-powered research reports</p>
  </div>
  <div style="background: #ffffff; padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="margin: 0 0 16px; font-size: 18px; color: #1f2937;">Confirm your subscription</h2>
    <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Click the button below to confirm your subscription. Once confirmed, you'll receive a daily research report every morning at 7:00 AM CDT.
    </p>
    <a href="${confirmUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
      Confirm Subscription
    </a>
    <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
      Or copy this link: <a href="${confirmUrl}" style="color: #2563eb;">${confirmUrl}</a>
    </p>
  </div>
  <p style="margin: 16px 0 0; color: #9ca3af; font-size: 11px; text-align: center;">
    You're receiving this because you signed up for AI Against Parkinson's. No spam, ever.
  </p>
</div>`
}

function buildSpanishConfirmEmail(confirmUrl: string): string {
  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 24px 28px; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">IA Contra el Parkinson</h1>
    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Informes diarios generados por agentes de IA</p>
  </div>
  <div style="background: #ffffff; padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="margin: 0 0 16px; font-size: 18px; color: #1f2937;">Confirma tu suscripcion</h2>
    <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Haz clic en el boton de abajo para confirmar tu suscripcion. Una vez confirmado, recibiras un informe diario de investigacion cada manana a las 7:00 AM CDT.
    </p>
    <a href="${confirmUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
      Confirmar Suscripcion
    </a>
    <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
      O copia este enlace: <a href="${confirmUrl}" style="color: #2563eb;">${confirmUrl}</a>
    </p>
  </div>
  <p style="margin: 16px 0 0; color: #9ca3af; font-size: 11px; text-align: center;">
    Estas recibiendo esto porque te suscribiste a IA Contra el Parkinson. Sin spam, nunca.
  </p>
</div>`
}
