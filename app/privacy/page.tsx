import type { Metadata } from 'next'
import { AppShell } from '@/components/product/app-shell'
import { PageHeading } from '@/components/product/page-heading'
import { AnalyticsPreferences } from '@/components/product/analytics-preferences'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How WorkingNow handles browser storage, optional analytics, and information you enter.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return <AppShell><main className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><PageHeading eyebrow="Privacy" title="Privacy Policy" description="WorkingNow is designed to keep everyday tool use on your device." /><div className="mt-8 space-y-6 text-sm leading-7 text-slate-600"><section><h2 className="font-semibold text-slate-900">Information you enter</h2><p className="mt-2">Text, names, dates, and calculations entered into browser tools are processed locally and are not intentionally sent to WorkingNow servers.</p></section><section><h2 className="font-semibold text-slate-900">Local storage</h2><p className="mt-2">Favorites, recent tools, preferences, and game records may be stored in this browser. You can clear them using your browser storage controls. Clearing storage may remove saved preferences and history. Analytics choice is stored in browser local storage; WorkingNow does not use a consent cookie.</p></section><section><h2 className="font-semibold text-slate-900">Optional analytics</h2><p className="mt-2">Vercel Web Analytics is disabled until you consent. If enabled, automatic page URLs have their query strings and fragments removed. Product events contain only an allow-listed tool/game/content identifier, category, duration, and entry source — never tool inputs or user-provided text. You can change the choice below.</p><AnalyticsPreferences /></section><section><h2 className="font-semibold text-slate-900">Advertising</h2><p className="mt-2">No advertising is currently served. Ad placements are disabled by default; setting NEXT_PUBLIC_ADS_ENABLED only enables visual placeholders and does not connect an ad network. Any future advertising or consent requirements must be reviewed before a live ad integration.</p></section><section><h2 className="font-semibold text-slate-900">Contact</h2><p className="mt-2">For privacy questions, contact the WorkingNow site operator using the contact channel published with the deployed service. A verified contact address must be published before production launch.</p></section></div></main></AppShell>
}
