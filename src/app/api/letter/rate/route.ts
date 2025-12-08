import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { rating } = await request.json()

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      )
    }

    // Here you can save the rating to database or analytics
    // For now, just return success
    console.log('User rating:', rating)

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
