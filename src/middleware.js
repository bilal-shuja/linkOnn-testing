
import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const authRoutes = [
        '/auth/sign-in',
        '/auth/sign-up',
        '/auth/forgot-password',
        '/auth/reset-password'
    ];

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isProtectedRoute = pathname.startsWith('/pages');

    const token = request.cookies.get('token');

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (isProtectedRoute && !token) {
        const signInUrl = new URL('/auth/sign-in', request.url);
        signInUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/pages/:path*',
        '/auth/:path*',
        '/'
    ]
};