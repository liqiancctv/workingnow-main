import type { Metadata } from 'next'
import { AppShell } from '@/components/product/app-shell'
import { ToolListing } from '@/components/product/tool-listing'
import { getTools } from '@/data/tools'

export const metadata: Metadata = {
  title: 'Meeting Tools for Global Teams',
  description: 'Plan meetings, compare time zones, and manage workday time with practical browser-based tools.',
  alternates: { canonical: '/meetings' },
  openGraph: { title: 'Meeting Tools for Global Teams', description: 'Practical meeting and time zone tools.', type: 'website' },
}

export default function MeetingsPage() {
  void getTools('meetings')
  return <AppShell><ToolListing category="meetings" /></AppShell>
}
