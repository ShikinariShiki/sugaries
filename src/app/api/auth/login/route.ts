import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// TODO: Move this to environment variable
const ADMIN_PASSWORD_HASH = '$2a$10$YourHashedPasswordHere' // You'll need to generate this

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // For now, simple password check - you should use bcrypt in production
    const isValid = password === process.env.ADMIN_PASSWORD || password === 'sugaries2024'

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create session
    const response = NextResponse.json({ success: true })
    
    // Set HTTP-only cookie for session
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
