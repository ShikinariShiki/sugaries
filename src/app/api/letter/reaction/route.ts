import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const letterId = searchParams.get('letterId')

    if (!letterId) {
      return NextResponse.json({ error: 'letterId is required' }, { status: 400 })
    }

    const reactions = await prisma.reaction.findMany({
      where: { letterId },
      orderBy: { createdAt: 'asc' },
    })

    // Group reactions by emoji
    const grouped: Record<string, { count: number; names: string[]; details: { id: string; name: string; createdAt: string }[] }> = {}
    for (const r of reactions) {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { count: 0, names: [], details: [] }
      }
      grouped[r.emoji].count++
      if (r.name) {
        grouped[r.emoji].names.push(r.name)
      }
      grouped[r.emoji].details.push({
        id: r.id,
        name: r.name || 'Anonymous',
        createdAt: r.createdAt.toISOString(),
      })
    }

    return NextResponse.json({ reactions: grouped })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { letterId, emoji, name } = await request.json()

    if (!letterId || !emoji) {
      return NextResponse.json({ error: 'letterId and emoji are required' }, { status: 400 })
    }

    // Check if the user already reacted with this exact emoji on this letter
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        letterId,
        emoji,
        name: name || null,
      },
    })

    if (existingReaction) {
      // If it exists, delete it (cancel reaction)
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      })
      return NextResponse.json({ success: true, toggledOff: true })
    }

    // If it doesn't exist, create it
    const reaction = await prisma.reaction.create({
      data: {
        letterId,
        emoji,
        name: name || null,
      },
    })

    return NextResponse.json({ success: true, reaction })
  } catch (error) {
    console.error('Error handling reaction:', error)
    return NextResponse.json({ error: 'Failed to handle reaction' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reactionId = searchParams.get('reactionId')

    if (!reactionId) {
      return NextResponse.json({ error: 'reactionId is required' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reaction = await prisma.reaction.findUnique({
      where: { id: reactionId },
      include: { letter: true },
    })

    if (!reaction) {
      return NextResponse.json({ error: 'Reaction not found' }, { status: 404 })
    }

    // Only administrators or the creator of the letter can delete reactions
    // @ts-ignore
    const isAdmin = session.user.role === 'admin'
    // @ts-ignore
    const isCreator = reaction.letter.userId === session.user.id

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.reaction.delete({
      where: { id: reactionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reaction:', error)
    return NextResponse.json({ error: 'Failed to delete reaction' }, { status: 500 })
  }
}
