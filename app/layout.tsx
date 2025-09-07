// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skillona — AI Viral Video Generator',
  description: 'Landing placeholder. Go to /sign-in, /sign-up or /dashboard.',
};

const hasClerk =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'string' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0;

let ClerkProvider: any = ({ children }: { children: React.ReactNode }) => <>{children}</>;
if (hasClerk) {
  ClerkProvider = require('@clerk/nextjs').ClerkProvider;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
