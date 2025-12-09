import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple in-memory store (for demo - in production use database)
const profiles = new Map<string, { name: string; email: string; avatar?: string }>()

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get profile from store or return default
    const profile = profiles.get(sessionCookie.value) || {
      name: 'Admin',
      email: 'admin@sugaries.app',
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, avatar } = body

    // Validate
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Save profile
    profiles.set(sessionCookie.value, { name, email, avatar })

    return NextResponse.json({ 
      success: true,
      profile: { name, email, avatar }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
