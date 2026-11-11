import { StealthNav } from '@/components/stealth-nav'
import { getTranslations, type Locale } from '@/lib/translations'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return { title: `${t.outlook_title} | ${t.brand}` }
}

export default async function OutlookPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng: rawLng } = await params
  const lng = (rawLng in { en: true, zh: true, ja: true } ? rawLng : 'en') as Locale
  const t = getTranslations(lng)

  return (
    <main className="flex h-dvh min-h-[500px] flex-col overflow-hidden bg-white">
      <StealthNav lng={lng} active="outlook" />
      <iframe title={t.outlook_title} src="/MSOutlookit/index.html" className="min-h-0 flex-1 border-0" />
    </main>
  )
}