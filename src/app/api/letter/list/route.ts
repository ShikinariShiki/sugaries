import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Fetching letters ===')

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // STRICT DATA ISOLATION: Always filter by the current user's ID.
    // Even admins should only see their own letters in their personal dashboard.
    // If we need a "Super Admin" view, that should be a separate page/route.
    const whereClause = { userId: session.user.id }

    const allLetters = await prisma.letter.findMany({
      where: whereClause,
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
        userId: true,
      },
    })

    // console.log(`Total letters found: ${allLetters.length} (Admin: ${isAdmin}, User: ${session.user.email})`)
    console.log(`Total letters found: ${allLetters.length} (User: ${session.user.id})`)

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
