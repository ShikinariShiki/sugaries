import { NextRequest, NextResponse } from 'next/server'

// Configure route for Vercel deployment (no file system access needed)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Upload API Called ===')
    
    const formData = await request.formData()
    console.log('FormData received')
    
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('No file in FormData')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large:', file.size)
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Convert to base64 data URL for Vercel deployment (no file system)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    console.log('Image converted to base64, length:', base64.length)

    // Return the data URL (works on Vercel's read-only filesystem)
    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
