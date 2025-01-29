import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const path = request.nextUrl.pathname
  
  const isProtectedRoute = path.startsWith('/app') && !path.startsWith('/app/login')
  const isAuthRoute = path.startsWith('/app/login')

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/app/unauthorized', request.url))
  }

  if (isAuthRoute && token) {
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
