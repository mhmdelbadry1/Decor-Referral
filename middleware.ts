import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, hashSecret } from '@/lib/auth'

export const config = {
  matcher: '/admin/:path*',
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = req.cookies.get(ADMIN_COOKIE)?.value

  // ── Login page: always accessible ──────────────────────────
  if (pathname === '/admin/login') {
    // If already authenticated, skip login and go straight to dashboard
    if (sessionCookie) {
      const expected = await hashSecret(process.env.ADMIN_SECRET ?? '')
      if (sessionCookie === expected) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
    }
    return NextResponse.next()
  }

  // ── All other /admin/* routes require a valid session cookie ─
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const expected = await hashSecret(process.env.ADMIN_SECRET ?? '')
  if (sessionCookie !== expected) {
    // Cookie is present but wrong (e.g. secret was rotated) → clear and redirect
    const res = NextResponse.redirect(new URL('/admin/login', req.url))
    res.cookies.delete(ADMIN_COOKIE)
    return res
  }

  return NextResponse.next()
}
