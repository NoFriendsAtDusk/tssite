import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // Simple admin validation - in a real app, this should be done against a database
  if (username === "admin" && password === "admin123") {
    // Set HTTP-only cookie
    cookies().set('session', btoa(username), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, error: "認証に失敗しました" },
    { status: 401 }
  )
}
