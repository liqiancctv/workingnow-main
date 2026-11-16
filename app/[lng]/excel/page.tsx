import type { Metadata } from 'next'
import { createLegacyMetadata } from '@/lib/seo/legacy-metadata'
import { ExcelWorkbook } from '@/components/excel-workbook'
import { getTranslations, type Locale } from '@/lib/translations'
import { languages } from '@/lib/translations'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return createLegacyMetadata(lng, 'excel', t.excel_title, t.excel_title)
}

export default async function ExcelPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng: rawLng } = await params
  if (!languages.includes(rawLng as Locale)) notFound()
  const lng = rawLng as Locale
  return <ExcelWorkbook lng={lng} />
}