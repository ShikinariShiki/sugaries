import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // If not logged in, redirect to signin
  if (!token) {
    const url = new URL('/auth/signin', req.url)
    url.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(url)
  }
  
  // Allow compose page for all authenticated users
  if (req.nextUrl.pathname === '/admin/compose') {
    return NextResponse.next()
  }
  
  // All other admin pages require admin role
  if (token.role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/compose', req.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
