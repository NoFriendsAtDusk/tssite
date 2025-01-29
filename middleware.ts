import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const session = request.cookies.get('session')?.value

  // Protected routes - all routes under /app except /app/login and /app/unauthorized
  const isProtectedRoute = path.startsWith('/app') && 
    !path.startsWith('/app/login') && 
    !path.startsWith('/app/unauthorized')
  
  // Auth route - /app/login
  const isAuthRoute = path === '/app/login' || path === '/app/login/'

  // If accessing root app path, redirect to login if not authenticated
  if (path === '/app' || path === '/app/') {
    if (!session) {
      return NextResponse.redirect(new URL('/app/login', request.url))
    }
  }

  // Redirect to unauthorized page if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/app/unauthorized', request.url))
  }

  // Redirect to app if accessing login with valid session
  if (isAuthRoute && session) {
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
