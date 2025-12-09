import { prisma } from './prisma'

// Generate a random short code (6 characters: alphanumeric)
function generateRandomCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate a unique short code that doesn't exist in database
export async function generateUniqueShortCode(): Promise<string> {
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const code = generateRandomCode(6)
    
    // Check if code already exists
    const existing = await prisma.letter.findUnique({
      where: { shortCode: code }
    })

    if (!existing) {
      return code
    }

    attempts++
  }

  // If all attempts fail, use longer code
  return generateRandomCode(8)
}
