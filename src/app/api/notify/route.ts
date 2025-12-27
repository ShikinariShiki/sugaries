import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, letterData } = body

    // Type can be: 'opened' or 'replied'
    const adminEmail = 'shikimanmaru@gmail.com'

    let subject = ''
    let html = ''

    if (type === 'opened') {
      subject = `📬 Letter Opened - ${letterData.recipientName}`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ec4899;">📬 Letter Opened!</h2>
          <p>Someone has opened your letter:</p>
          <div style="background: #f9fafb; border-left: 4px solid #ec4899; padding: 15px; margin: 20px 0;">
            <p><strong>Recipient:</strong> ${letterData.recipientName}</p>
            <p><strong>Letter ID:</strong> ${letterData.letterId}</p>
            <p><strong>Opened at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #6b7280;">View the letter at: <a href="https://gulalies.app/letter/${letterData.letterId}?admin=true">Letter Link</a></p>
        </div>
      `
    } else if (type === 'replied') {
      subject = `💌 New Reply Received - ${letterData.senderName}`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8b5cf6;">💌 New Reply Received!</h2>
          <p>Someone has replied to your letter:</p>
          <div style="background: #f9fafb; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0;">
            <p><strong>From:</strong> ${letterData.senderName}</p>
            <p><strong>Reply ID:</strong> ${letterData.letterId}</p>
            <p><strong>Message Preview:</strong></p>
            <p style="color: #6b7280; font-style: italic;">${letterData.preview || 'View the full reply...'}</p>
            <p><strong>Replied at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #6b7280;">View the reply at: <a href="https://gulalies.app/letter/${letterData.letterId}?admin=true">Reply Link</a></p>
        </div>
      `
    }

    await resend.emails.send({
      from: 'Gulalies <onboarding@resend.dev>',
      to: adminEmail,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
