import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const grouped: Record<string, { count: number; names: string[] }> = {}
    for (const r of reactions) {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { count: 0, names: [] }
      }
      grouped[r.emoji].count++
      if (r.name) {
        grouped[r.emoji].names.push(r.name)
      }
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

    const reaction = await prisma.reaction.create({
      data: {
        letterId,
        emoji,
        name: name || null,
      },
    })

    return NextResponse.json({ success: true, reaction })
  } catch (error) {
    console.error('Error creating reaction:', error)
    return NextResponse.json({ error: 'Failed to create reaction' }, { status: 500 })
  }
}
