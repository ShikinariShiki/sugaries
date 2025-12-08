import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
