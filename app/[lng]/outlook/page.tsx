import { StealthNav } from '@/components/stealth-nav'
import { getTranslations, type Locale } from '@/lib/translations'
import type { Metadata } from 'next'
import { createLegacyMetadata } from '@/lib/seo/legacy-metadata'
import { languages } from '@/lib/translations'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return createLegacyMetadata(lng, 'outlook', t.outlook_title, t.outlook_title)
}

export default async function OutlookPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng: rawLng } = await params
  if (!languages.includes(rawLng as Locale)) notFound()
  const lng = rawLng as Locale
  const t = getTranslations(lng)

  return (
    <main className="flex h-dvh min-h-[500px] flex-col overflow-hidden bg-white">
      <StealthNav lng={lng} active="outlook" />
      <iframe title={t.outlook_title} src="/MSOutlookit/index.html" className="min-h-0 flex-1 border-0" />
    </main>
  )
}