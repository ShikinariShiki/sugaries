import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's onboarded status
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isOnboarded: true }
    })

    return NextResponse.json({ isOnboarded: user?.isOnboarded || false })
  } catch (error) {
    console.error('Check onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    )
  }
}
