import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = ['/login'];
const apiPaths = ['/api'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public or an API route
  const isPublicPath = publicPaths.some(p => path.startsWith(p));
  const isApiPath = apiPaths.some(p => path.startsWith(p));

  // Skip middleware for API routes and static files
  if (isApiPath) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const authStorage = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  
  try {
    if (authStorage) {
      const authData = JSON.parse(decodeURIComponent(authStorage));
      isAuthenticated = authData.state?.isAuthenticated === true;
    }
  } catch (error) {
    console.error('Error parsing auth storage:', error);
  }

  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    // If user is authenticated and tries to access login page,
    // redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !isAuthenticated) {
    // If user is not authenticated and tries to access protected route,
    // redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 