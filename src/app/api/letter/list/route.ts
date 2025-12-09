import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Fetching letters ===')
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
        pin: true, // Include plain PIN for admin viewing
        isReply: true,
        senderName: true,
        rating: true,
        musicUrl: true,
        musicTitle: true,
        musicArtist: true,
        imageUrl: true,
        letterColor: true,
        letterFont: true,
      },
    })

    console.log('Total letters found:', allLetters.length)

    // Split between sent (original letters) and received (replies)
    const sentLetters = allLetters.filter(letter => !letter.isReply || letter.isReply === null)
    const receivedLetters = allLetters.filter(letter => letter.isReply === true)

    console.log('Sent letters:', sentLetters.length)
    console.log('Received letters (replies):', receivedLetters.length)
    console.log('Reply details:', receivedLetters.map(l => ({ id: l.id, sender: l.senderName, isReply: l.isReply, hasImage: !!l.imageUrl, rating: l.rating })))

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
