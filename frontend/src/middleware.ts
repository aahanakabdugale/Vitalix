import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request }) // Re-create response with updated cookies
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // ── Define Routes ──────────────────────────────────
  const isPublicPage = path === '/landing' || 
                       path === '/login' || 
                       path === '/signup' || 
                       path.startsWith('/health-card/')

  // ── Logic ──────────────────────────────────────────
  if (!user && !isPublicPage) {
    // Not logged in and trying to access a private page -> Redirect to landing
    return NextResponse.redirect(new URL('/landing', request.url))
  }

  if (user && (path === '/landing' || path === '/login' || path === '/signup')) {
    // Logged in and trying to access auth pages -> Redirect to Dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}