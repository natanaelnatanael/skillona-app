// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // napravi ovaj fajl ako ga nemaš

export const metadata: Metadata = {
  title: "Skillona AI",
  description: "AI Viral Video Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
