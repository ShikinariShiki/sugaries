import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { rating, letterId } = await request.json()

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      )
    }

    if (!letterId) {
      return NextResponse.json(
        { error: 'Letter ID required' },
        { status: 400 }
      )
    }

    // Update the letter with the rating
    await prisma.letter.update({
      where: { id: letterId },
      data: { rating },
    })

    console.log('User rating saved:', { letterId, rating })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error saving rating:', error)
    return NextResponse.json(
      { error: 'Failed to save rating' },
      { status: 500 }
    )
  }
}
