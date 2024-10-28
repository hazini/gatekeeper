import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If has token and trying to access login page
  if (token && isPublicPath) {
    const dashboardUrl = new URL('/licenses', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
