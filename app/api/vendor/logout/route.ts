import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/vendor/login', request.url))
  res.cookies.set('vendor_session', '', { maxAge: 0, path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
  return res
}

export const DELETE = GET
