import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import SessionWrapper from "@/components/auth/SessionWrapper";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pixel Duel",
  description: "Choose the better pixel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionWrapper>
        <body
          className={cn(
            "min-h-screen bg-red-50 font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <Toaster richColors position="top-center" />
        </body>
      </SessionWrapper>
    </html>
  );
}
