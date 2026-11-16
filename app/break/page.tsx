import type { Metadata } from 'next'
import { AppShell } from '@/components/product/app-shell'
import { ToolListing } from '@/components/product/tool-listing'

export const metadata: Metadata = {
  title: 'Workday Breaks and Quick Games',
  description: 'Take a short, no-sign-up break with a timer or a quick browser game.',
  alternates: { canonical: '/break' },
  openGraph: { title: 'Workday Breaks and Quick Games', description: 'Short breaks and lightweight games.', type: 'website' },
}

export default function BreakPage() {
  return <AppShell><ToolListing category="break" /></AppShell>
}
