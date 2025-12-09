import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateUniqueShortCode } from '@/lib/shortcode'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { recipientName, pin, content, musicUrl, musicTitle, musicArtist, imageUrl, letterColor, letterFont } = await request.json()

    console.log('Creating letter with:', { recipientName, pin, content, musicUrl, musicTitle, musicArtist, imageUrl, letterColor, letterFont })

    if (!recipientName || !pin || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 10)
    
    // Generate unique short code (try-catch to handle if column doesn't exist yet)
    let shortCode: string | undefined
    try {
      shortCode = await generateUniqueShortCode()
    } catch (error) {
      console.log('Short code generation failed (column may not exist yet):', error)
      shortCode = undefined
    }

    // Create the letter linked to the user
    const letter = await prisma.letter.create({
      data: {
        recipientName,
        pinHash,
        pin, // Store plain PIN for admin viewing
        content,
        ...(shortCode && { shortCode }), // Only add if generation succeeded
        musicUrl: musicUrl || null,
        musicTitle: musicTitle || null,
        musicArtist: musicArtist || null,
        imageUrl: imageUrl || null,
        letterColor: letterColor || 'pink',
        letterFont: letterFont || 'handwriting',
        isReply: false,
        userId: session.user.id, // Link to authenticated user
      },
      select: {
        id: true,
        shortCode: true,
        musicUrl: true,
        imageUrl: true,
      },
    })

    console.log('Letter created:', letter)

    // Return the letter ID and short code (if available)
    return NextResponse.json({
      letterId: letter.id,
      shortCode: letter.shortCode || null,
      url: `/letter/${letter.id}`,
      shortUrl: letter.shortCode ? `/${letter.shortCode}` : null,
    })
  } catch (error) {
    console.error('Create letter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
