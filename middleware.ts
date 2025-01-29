import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const session = request.cookies.get('session')?.value

  // Protected routes - all routes under /app except /app/login
  const isProtectedRoute = path.startsWith('/app') && 
    !path.startsWith('/app/login')
  
  // Auth route - /app/login
  const isAuthRoute = path === '/app/login' || path === '/app/login/'

  // Handle root app path
  if (path === '/app' || path === '/app/') {
    if (!session) {
      return NextResponse.redirect(new URL('/app/login', request.url))
    }
    return NextResponse.next()
  }

  // Handle static files
  if (path === '/' || path.startsWith('/static/')) {
    return NextResponse.next()
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
