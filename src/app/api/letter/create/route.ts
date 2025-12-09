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

    const { 
      recipientName, 
      senderName,
      pin, 
      usePinProtection,
      customShortCode,
      content, 
      musicUrl, 
      musicTitle, 
      musicArtist, 
      imageUrl, 
      letterColor, 
      letterFont 
    } = await request.json()

    console.log('Creating letter with:', { recipientName, senderName, pin, usePinProtection, customShortCode, content })

    if (!recipientName || !content) {
      return NextResponse.json(
        { error: 'Recipient name and content are required' },
        { status: 400 }
      )
    }

    // Validate PIN if protection is enabled
    if (usePinProtection && !pin) {
      return NextResponse.json(
        { error: 'PIN is required when PIN protection is enabled' },
        { status: 400 }
      )
    }

    // Hash the PIN only if protection is enabled
    const pinHash = usePinProtection && pin ? await bcrypt.hash(pin, 10) : null
    const plainPin = usePinProtection && pin ? pin : null
    
    // Handle short code - use custom if provided, otherwise generate
    let shortCode: string | undefined
    try {
      if (customShortCode && customShortCode.trim()) {
        // Validate custom short code (alphanumeric, 4-20 chars)
        const cleanCode = customShortCode.trim().replace(/[^a-zA-Z0-9]/g, '')
        if (cleanCode.length < 4 || cleanCode.length > 20) {
          return NextResponse.json(
            { error: 'Short code must be 4-20 alphanumeric characters' },
            { status: 400 }
          )
        }
        
        // Check if custom code already exists
        const existing = await prisma.letter.findUnique({
          where: { shortCode: cleanCode }
        })
        
        if (existing) {
          return NextResponse.json(
            { error: 'This short code is already taken. Please choose another.' },
            { status: 400 }
          )
        }
        
        shortCode = cleanCode
      } else {
        // Auto-generate
        shortCode = await generateUniqueShortCode()
      }
    } catch (error) {
      console.log('Short code handling failed (column may not exist yet):', error)
      shortCode = undefined
    }

    console.log('Creating letter with data:', { 
      recipientName, 
      senderName: senderName || session.user.name || 'Anonymous', 
      hasPinHash: !!pinHash,
      hasPlainPin: !!plainPin,
      shortCode,
      usePinProtection
    })

    // Create the letter linked to the user
    const letter = await prisma.letter.create({
      data: {
        recipientName,
        senderName: senderName || session.user.name || 'Anonymous',
        pinHash,
        pin: plainPin,
        content,
        ...(shortCode && { shortCode }),
        musicUrl: musicUrl || null,
        musicTitle: musicTitle || null,
        musicArtist: musicArtist || null,
        imageUrl: imageUrl || null,
        letterColor: letterColor || 'pink',
        letterFont: letterFont || 'handwriting',
        isReply: false,
        userId: session.user.id,
      },
      select: {
        id: true,
        shortCode: true,
        musicUrl: true,
        imageUrl: true,
      },
    })

    console.log('Letter created successfully:', letter)

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
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
