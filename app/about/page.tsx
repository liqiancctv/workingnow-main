import type { Metadata } from 'next'
import { AppShell } from '@/components/product/app-shell'
import { PageHeading } from '@/components/product/page-heading'

export const metadata: Metadata = {
  title: 'About WorkingNow',
  description: 'Learn about WorkingNow, a simple browser-based companion for everyday work.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return <AppShell><main className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><PageHeading eyebrow="About" title="A little help for the workday" description="WorkingNow brings together practical meeting helpers, everyday tools, and short breaks in one lightweight place." /><div className="mt-8 space-y-4 text-sm leading-7 text-slate-600"><p>Use the tools directly in your browser without creating an account. Calculations and text processing happen on your device.</p><p>WorkingNow is designed to be quick to open, easy to understand, and useful across time zones.</p></div></main></AppShell>
}
