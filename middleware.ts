import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  if (path.startsWith('/vendor/dashboard')) {
    const session = request.cookies.get('vendor_session')
    if (!session || session.value !== 'valid') {
      return NextResponse.redirect(new URL('/vendor/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/vendor/dashboard/:path*']
}
