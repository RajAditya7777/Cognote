import { NextResponse } from 'next/server';

// Edge-compatible JWT verification (simplified for middleware)
function verifyTokenEdge(token) {
  if (!token) return null;
  
  try {
    // Simple JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode payload (base64url)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString()
    );
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const authRoutes = ['/auth'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get token from cookies or Authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // If accessing a protected route
  if (isProtectedRoute) {
    if (!token) {
      // No token, redirect to auth page
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Verify token
    const payload = verifyTokenEdge(token);
    if (!payload) {
      // Invalid token, redirect to auth page
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(url);
      
      // Clear invalid token cookie
      response.cookies.delete('token');
      return response;
    }

    // Token is valid, add user info to headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-user-email', payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // If accessing auth routes while already authenticated
  if (isAuthRoute && token) {
    const payload = verifyTokenEdge(token);
    if (payload) {
      // User is already authenticated, redirect to dashboard
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};