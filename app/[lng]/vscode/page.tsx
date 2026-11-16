import { VSCodeSkin } from '@/components/vscode-skin'
import { languages, getTranslations, type Locale } from '@/lib/translations'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createLegacyMetadata } from '@/lib/seo/legacy-metadata'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return createLegacyMetadata(lng, 'vscode', t.home_code_title, t.home_code_description)
}

export default async function VSCodePage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  if (!languages.includes(lng as Locale)) notFound()
  return <VSCodeSkin lng={lng as Locale} />
}