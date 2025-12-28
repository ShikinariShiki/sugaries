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

    // Return the correct name and non-sensitive options
    return NextResponse.json({
      correctName: letter.recipientName,
      letterColor: letter.letterColor,
      letterFont: letter.letterFont,
      headerText: letter.headerText,
    })
  } catch (error) {
    console.error('Verify name error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
