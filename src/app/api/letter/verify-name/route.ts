import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { letterId, name } = await request.json()

    if (!letterId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find letter by ID (NEVER return content or pinHash)
    const letter = await prisma.letter.findUnique({
      where: { id: letterId },
      select: {
        recipientName: true,
        letterColor: true,
        letterFont: true,
        headerText: true,
        pin: true, // Select PIN only to count length, do not return it
        // Explicitly exclude sensitive fields
      },
    })

    if (!letter) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      )
    }

    // Case-insensitive name comparison
    const nameMatch = letter.recipientName.toLowerCase() === name.toLowerCase()

    if (!nameMatch) {
      return NextResponse.json(
        { error: 'Name does not match' },
        { status: 401 }
      )
    }

    // Calculate PIN length (default to 4 if null/empty, though it should be handled)
    const pinLength = letter.pin ? letter.pin.length : 4

    // Return the correct name, options, and PIN length
    return NextResponse.json({
      correctName: letter.recipientName,
      letterColor: letter.letterColor,
      letterFont: letter.letterFont,
      headerText: letter.headerText,
      pinLength: pinLength,
    })
  } catch (error) {
    console.error('Verify name error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
