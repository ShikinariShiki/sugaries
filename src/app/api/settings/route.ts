import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                emailNotifications: true,
                newLetterAlerts: true,
                weeklyDigest: true,
                soundEffects: true,
                autoRefresh: true,
                refreshInterval: true,
            }
        })

        if (!user) {
            return new NextResponse('User not found', { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Failed to fetch settings:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const body = await req.json()
        const {
            emailNotifications,
            newLetterAlerts,
            weeklyDigest,
            soundEffects,
            autoRefresh,
            refreshInterval
        } = body

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                emailNotifications,
                newLetterAlerts,
                weeklyDigest,
                soundEffects,
                autoRefresh,
                refreshInterval
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error('Failed to update settings:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
