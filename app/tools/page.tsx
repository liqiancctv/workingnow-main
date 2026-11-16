import type { Metadata } from 'next'
import { AppShell } from '@/components/product/app-shell'
import { ToolListing } from '@/components/product/tool-listing'

export const metadata: Metadata = {
  title: 'Everyday Work Tools',
  description: 'Use simple percentage, text, comparison, and random selection tools directly in your browser.',
  alternates: { canonical: '/tools' },
  openGraph: { title: 'Everyday Work Tools', description: 'Small, useful tools for common workday tasks.', type: 'website' },
}

export default function ToolsPage() {
  return <AppShell><ToolListing category="tools" /></AppShell>
}
