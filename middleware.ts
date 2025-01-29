import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Get token from session cookie
  const session = request.cookies.get('session')?.value

  // Protected routes - add any routes that should be protected
  const isProtectedRoute = path === '/'

  // Auth routes - routes that are used for authentication
  const isAuthRoute = path === '/login'

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    return response
  }

  // Redirect to home if accessing auth route with session
  if (isAuthRoute && session) {
    const response = NextResponse.redirect(new URL('/', request.url))
    return response
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login']
}
