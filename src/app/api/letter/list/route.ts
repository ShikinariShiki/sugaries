import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication to track user's letters
    // For now, returning all letters (you'll need to add user auth later)
    
    const allLetters = await prisma.letter.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        recipientName: true,
        content: true,
        createdAt: true,
        isOpened: true,
        pinHash: true,
        isReply: true,
        senderName: true,
      },
    })

    // Split between sent (original letters) and received (replies)
    const sentLetters = allLetters.filter(letter => !letter.isReply || letter.isReply === null)
    const receivedLetters = allLetters.filter(letter => letter.isReply === true)

    return NextResponse.json({
      sent: sentLetters,
      received: receivedLetters,
    })
  } catch (error) {
    console.error('List letters error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
