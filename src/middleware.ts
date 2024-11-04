import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não estiver autenticado e tentar acessar uma rota protegida
  if (!session && (req.nextUrl.pathname.startsWith('/portfolio'))) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Se estiver autenticado e acessar a página inicial ou login
  if (session && (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/auth/login')) {
    return NextResponse.redirect(new URL('/portfolio', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/auth/login', '/portfolio/:path*']
} 