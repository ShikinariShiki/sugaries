import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
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

    // Create the letter
    const letter = await prisma.letter.create({
      data: {
        recipientName,
        pinHash,
        pin, // Store plain PIN for admin viewing
        content,
        musicUrl: musicUrl || null,
        musicTitle: musicTitle || null,
        musicArtist: musicArtist || null,
        imageUrl: imageUrl || null,
        letterColor: letterColor || 'pink',
        letterFont: letterFont || 'handwriting',
        isReply: false,
      },
      select: {
        id: true,
        musicUrl: true,
        imageUrl: true,
      },
    })

    console.log('Letter created:', letter)

    // Return the letter ID (used as URL slug)
    return NextResponse.json({
      letterId: letter.id,
      url: `/letter/${letter.id}`,
    })
  } catch (error) {
    console.error('Create letter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
