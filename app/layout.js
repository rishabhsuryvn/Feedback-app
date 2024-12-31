"use client";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const nuninto_sans = Nunito_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={nuninto_sans.className}>{children}</body>
      </SessionProvider>
    </html>
  );
}
