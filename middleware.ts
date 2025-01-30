import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Handle static files
  if (path === '/' || path.startsWith('/static/')) {
    return NextResponse.next()
  }

  // Protected routes - all routes under /app except /app/login
  const isProtectedRoute = path.startsWith('/app') && 
    !path.startsWith('/app/login')
  
  // Auth route - /app/login
  const isAuthRoute = path === '/app/login' || path === '/app/login/'

  // If the user is not logged in and trying to access a protected route
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/app/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If the user is logged in and trying to access login page
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/app/:path*',  // Match all paths under /app
  ]
}
