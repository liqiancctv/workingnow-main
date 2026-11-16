import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { headers } from 'next/headers'
import { legacyLanguages, productLocales } from '@/app/i18n/settings'

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://workingnow.live'),
  title: {
    default: 'WorkingNow — Your Everyday Workday Companion',
    template: '%s | WorkingNow',
  },
  description: 'Simple tools for meetings, everyday work, and short breaks.',
  applicationName: 'WorkingNow',
  openGraph: {
    siteName: 'WorkingNow',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers()
  const requestedLocale = requestHeaders.get('x-workingnow-locale') ?? 'en'
  const allowedDocumentLocales: readonly string[] = [...productLocales, ...legacyLanguages]
  const lang = allowedDocumentLocales.includes(requestedLocale) ? requestedLocale : 'en'
  return (
    <html
      lang={lang}
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
