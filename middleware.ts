// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware({
  // Javno dostupne rute:
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)', '/api/status'],
  // Zaštiti sve ispod /dashboard
  ignoredRoutes: ['/api/status'],
});

export const config = {
  matcher: [
    // sve app-rute
    '/((?!_next|.*\\..*).*)',
    // uvijek middleware na ove:
    '/(api|trpc)(.*)',
  ],
};
