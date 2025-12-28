import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ notifications: [], unreadCount: 0 })
    }

    // Get user's last read timestamp
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastReadNotificationAt: true }
    })

    const lastReadAt = user?.lastReadNotificationAt || new Date(0)

    // Fetch recent letters with activity related to this user
    // STRICT ISOLATION: Only fetch letters belonging to this user
    const recentLetters = await prisma.letter.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { isOpened: true },
          { isReply: true }
        ]
      },
      orderBy: {
        createdAt: 'desc' // Most recent activity first
      },
      take: 20,
      select: {
        id: true,
        recipientName: true,
        senderName: true,
        isOpened: true,
        isReply: true,
        createdAt: true,

        // Assuming we want to notify when *something happens*.
        // If 'isOpened' becomes true, we don't have an 'openedAt' field in the schema presented. 
        // We will use createdAt for now as a proxy or just show the interaction.
        // Ideally we should have an ActivityLog, but for now we follow the user request to "persist" the read status.
      }
    })

    // Transform to notifications
    const notifications = recentLetters.map(letter => {
      // NOTE: Because we don't have 'openedAt' or 'repliedAt', we are using 'createdAt'.
      // This is a limitation of the current schema. 
      // However, the user asked for *persistence* of the "red bar" (unread status).
      // We will compare the relevant timestamp against lastReadNotificationAt.

      const timestamp = new Date(letter.createdAt) // Ideally this should be the event time
      const isUnread = timestamp > lastReadAt

      const now = new Date()
      const diffMs = now.getTime() - timestamp.getTime()
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
          letterId: letter.id,
          message: `You received a reply from ${letter.senderName}`,
          time: timeAgo,
          unread: isUnread,
          timestamp: timestamp, // useful for sorting if needed
          icon: '💌'
        }
      } else if (letter.isOpened) {
        return {
          id: letter.id,
          letterId: letter.id,
          message: `Letter to ${letter.recipientName} was opened`,
          time: timeAgo,
          unread: isUnread,
          timestamp: timestamp,
          icon: 'email-open'
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

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update the last read timestamp to NOW
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastReadNotificationAt: new Date() }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification read status:', error)
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}
