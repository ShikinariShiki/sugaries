import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch recent letters with activity (opened, replied)
    const recentLetters = await prisma.letter.findMany({
      where: {
        OR: [
          { isOpened: true },
          { isReply: true }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        recipientName: true,
        senderName: true,
        isOpened: true,
        isReply: true,
        createdAt: true,
      }
    })

    // Transform to notifications
    const notifications = recentLetters.map(letter => {
      const now = new Date()
      const createdAt = new Date(letter.createdAt)
      const diffMs = now.getTime() - createdAt.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      let timeAgo = ''
      if (diffMins < 1) timeAgo = 'just now'
      else if (diffMins < 60) timeAgo = `${diffMins} min ago`
      else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      else timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

      if (letter.isReply) {
        return {
          id: letter.id,
          message: `You received a reply from ${letter.senderName}`,
          time: timeAgo,
          unread: diffHours < 24,
          icon: '💌'
        }
      } else if (letter.isOpened) {
        return {
          id: letter.id,
          message: `Letter to ${letter.recipientName} was opened`,
          time: timeAgo,
          unread: diffHours < 24,
          icon: '📧'
        }
      }
      
      return null
    }).filter(Boolean)

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter(n => n?.unread).length
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
