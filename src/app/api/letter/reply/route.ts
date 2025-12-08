import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { recipientName, content, senderName } = await request.json()

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
        pinHash: null, // No password for replies
      },
    })

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
