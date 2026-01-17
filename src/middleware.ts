import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is simplified since Firebase Auth is handled client-side
// We only redirect from root to signin if needed
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to signin (client-side auth will redirect to dashboard if logged in)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
  ],
};
