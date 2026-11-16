import type { Metadata } from 'next'
import { AppShell } from '@/components/product/app-shell'
import { ToolListing } from '@/components/product/tool-listing'

export const metadata: Metadata = {
  title: 'Discover Something Interesting',
  description: 'Explore original trivia, interesting facts, office humor, and short quizzes.',
  alternates: { canonical: '/discover' },
  openGraph: { title: 'Discover Something Interesting', description: 'A little curiosity for your workday.', type: 'website' },
}

export default function DiscoverPage() {
  return <AppShell><ToolListing category="discover" /></AppShell>
}
