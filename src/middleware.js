import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const authRoutes = [
        '/auth/sign-in',
        '/auth/sign-up',
        '/auth/forgot-password',
        '/auth/reset-password'
    ];

    const publicRoutes = [
        '/pages/Wallet/success',  // ✅ Allow access after Stripe payment
        '/pages/Wallet/deposit-amount',    // ✅ Allow access if payment was canceled
        '/pages/Wallet/paystack-success'
    ];

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isProtectedRoute = pathname.startsWith('/pages');

    const token = request.cookies.get('token');

    // Prevent logged-in users from accessing auth routes (Sign-In, Sign-Up, etc.)
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow public routes (Success & Cancel pages) without authentication
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Redirect to sign-in if trying to access a protected route without a token
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
        '/',
        '/pages/Wallet/success',
        '/pages/Wallet/deposit-amount',
        '/pages/Wallet/paystack-success',
    ]
};
