import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { letterId, pin } = await request.json()

    if (!letterId) {
      return NextResponse.json(
        { error: 'Letter ID is required' },
        { status: 400 }
      )
    }

    // Fetch letter with pinHash and content
    const letter = await prisma.letter.findUnique({
      where: { id: letterId },
      select: {
        id: true,
        pinHash: true,
        content: true,
        isOpened: true,
        musicUrl: true,
        imageUrl: true,
        letterColor: true,
        letterFont: true,
        recipientName: true,
        headerText: true,
      },
    })

    if (!letter) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      )
    }

    // If letter has no PIN protection, allow access without PIN check
    if (!letter.pinHash) {
      // Mark letter as opened (first time only)
      if (!letter.isOpened) {
        await prisma.letter.update({
          where: { id: letterId },
          data: { isOpened: true },
        })

        // Send email notification
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'opened',
              letterData: {
                letterId: letter.id,
                recipientName: letter.recipientName,
              },
            }),
          })
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError)
        }
      }

      // Return content immediately for non-protected letters
      return NextResponse.json({
        content: letter.content,
        musicUrl: letter.musicUrl || null,
        imageUrl: letter.imageUrl || null,
        letterColor: letter.letterColor || 'mint',
        letterFont: letter.letterFont || 'handwriting',
        recipientName: letter.recipientName,
        headerText: letter.headerText,
        pinHash: null,
      })
    }

    // For PIN-protected letters, require PIN
    if (!pin) {
      return NextResponse.json(
        { error: 'PIN is required for this letter' },
        { status: 400 }
      )
    }

    // Verify PIN using bcrypt
    const pinMatch = await bcrypt.compare(pin, letter.pinHash)

    if (!pinMatch) {
      return NextResponse.json(
        { error: 'Incorrect PIN' },
        { status: 401 }
      )
    }

    // Mark letter as opened (first time only)
    if (!letter.isOpened) {
      await prisma.letter.update({
        where: { id: letterId },
        data: { isOpened: true },
      })

      // Send email notification
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'opened',
            letterData: {
              letterId: letter.id,
              recipientName: letter.recipientName,
            },
          }),
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the request if email fails
      }
    }

    console.log('Unlocking letter:', { id: letterId, musicUrl: letter.musicUrl, imageUrl: letter.imageUrl, letterColor: letter.letterColor, letterFont: letter.letterFont })

    // SUCCESS: Return the content
    return NextResponse.json({
      content: letter.content,
      musicUrl: letter.musicUrl || null,
      imageUrl: letter.imageUrl || null,
      letterColor: letter.letterColor || 'mint',
      letterFont: letter.letterFont || 'handwriting',
      headerText: letter.headerText,
    })
  } catch (error) {
    console.error('Unlock letter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
