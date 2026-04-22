import { NextResponse } from 'next/server'

export async function GET() {
  const res = NextResponse.redirect(new URL('/vendor/login', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'))
  res.cookies.set('vendor_session', '', { maxAge: 0, path: '/' })
  return res
}

export const DELETE = GET
