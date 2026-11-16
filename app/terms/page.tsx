import type { Metadata } from 'next'
import { AppShell } from '@/components/product/app-shell'
import { PageHeading } from '@/components/product/page-heading'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using WorkingNow browser tools and content.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return <AppShell><main className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><PageHeading eyebrow="Terms" title="Terms of Use" description="Use WorkingNow responsibly and verify important calculations before relying on them." /><div className="mt-8 space-y-6 text-sm leading-7 text-slate-600"><section><h2 className="font-semibold text-slate-900">Use of tools</h2><p className="mt-2">Tools are provided for convenience and may not account for every legal, financial, scheduling, or locale-specific rule. Confirm critical results independently.</p></section><section><h2 className="font-semibold text-slate-900">Availability</h2><p className="mt-2">Features may change or become unavailable. Local data is stored in your browser and should not be treated as a backup.</p></section><section><h2 className="font-semibold text-slate-900">Content</h2><p className="mt-2">Discover content is for general interest and is not professional advice.</p></section></div></main></AppShell>
}
