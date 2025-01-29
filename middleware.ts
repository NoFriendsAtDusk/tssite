import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get token from session cookie
  const session = request.cookies.get('session')?.value

  // Protected routes - all routes under /app except /app/login
  const isProtectedRoute = path.startsWith('/app') && !path.startsWith('/app/login')
  
  // Auth route - /app/login
  const isAuthRoute = path.startsWith('/app/login')

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/app/login', request.url))
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
