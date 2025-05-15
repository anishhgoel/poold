import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // When running in middleware, we cannot use setHeader for setting cookies
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // When running in middleware, we cannot use setHeader for removing cookies
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getSession();

  // If no session and on a protected route, redirect to auth
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  if (!data.session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If has session and on auth route, redirect to dashboard
  if (data.session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 