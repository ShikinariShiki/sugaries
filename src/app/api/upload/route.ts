import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Configure route to handle file uploads
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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('File converted to buffer, size:', buffer.length)

    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`
    
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      console.log('Creating uploads directory...')
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save to public/uploads directory
    const path = join(uploadsDir, filename)
    console.log('Saving file to:', path)
    
    await writeFile(path, buffer)
    console.log('File saved successfully')

    // Return the public URL
    const url = `/uploads/${filename}`
    console.log('Returning URL:', url)
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
