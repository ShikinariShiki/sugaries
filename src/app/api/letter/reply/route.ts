import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    console.log('=== Reply API Called ===')
    const { recipientName, content, senderName, rating, imageUrl } = await request.json()
    
    console.log('Reply data:', { recipientName, senderName, contentLength: content?.length, rating, hasImage: !!imageUrl })

    // Validate required fields
    if (!recipientName || !content || !senderName) {
      console.error('Missing required fields:', { recipientName: !!recipientName, content: !!content, senderName: !!senderName })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating reply letter in database...')
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
    
    console.log('Reply letter created:', letter.id, 'isReply:', letter.isReply)

    // Send email notification
    try {
      console.log('Sending email notification...')
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
      console.log('Email notification sent')
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    console.log('Returning success response')
    return NextResponse.json({
      success: true,
      letterId: letter.id,
    })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: `Failed to create reply: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
