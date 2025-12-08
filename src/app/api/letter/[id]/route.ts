import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    // Only allow admin bypass with proper authentication
    // For now, we'll check if there's an admin session cookie
    const adminSession = request.cookies.get('admin_session')
    
    if (!isAdmin || !adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const letter = await prisma.letter.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        musicUrl: true,
        imageUrl: true,
        letterColor: true,
        letterFont: true,
        recipientName: true,
        senderName: true,
        pinHash: true,
        isOpened: true,
        isReply: true,
        createdAt: true,
      },
    })

    if (!letter) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      )
    }

    // Mark as opened ONLY for received letters (replies) when admin views it
    // Sent letters should only be marked as opened when recipient unlocks with PIN
    if (!letter.isOpened && letter.senderName && letter.isReply) {
      await prisma.letter.update({
        where: { id },
        data: { isOpened: true },
      })
    }

    return NextResponse.json(letter)
  } catch (error) {
    console.error('Error fetching letter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch letter' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.letter.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting letter:', error)
    return NextResponse.json(
      { error: 'Failed to delete letter' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const letter = await prisma.letter.update({
      where: { id },
      data: { content },
    })

    return NextResponse.json({ success: true, letter })
  } catch (error) {
    console.error('Error updating letter:', error)
    return NextResponse.json(
      { error: 'Failed to update letter' },
      { status: 500 }
    )
  }
}
