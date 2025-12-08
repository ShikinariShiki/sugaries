import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { recipientName, content, senderName, rating, imageUrl } = await request.json()

    // Validate required fields
    if (!recipientName || !content || !senderName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create reply letter without PIN (automatically accessible to admin)
    const letter = await prisma.letter.create({
      data: {
        recipientName,
        content,
        isReply: true,
        senderName,
        rating: rating || null,
        imageUrl: imageUrl || null,
        pinHash: null, // No password for replies
      },
    })

    // Send email notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'replied',
          letterData: {
            letterId: letter.id,
            senderName,
            preview: content.substring(0, 120),
          },
        }),
      })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      letterId: letter.id,
    })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}
