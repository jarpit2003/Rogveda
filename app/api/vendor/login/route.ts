import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (username === process.env.VENDOR_USERNAME && password === process.env.VENDOR_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('vendor_session', 'valid', {
      httpOnly: true,
      path: '/',
      maxAge: 86400,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return response
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
