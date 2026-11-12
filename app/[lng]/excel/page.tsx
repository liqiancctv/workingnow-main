import type { Metadata } from 'next'
import { ExcelWorkbook } from '@/components/excel-workbook'
import { getTranslations, type Locale } from '@/lib/translations'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return { title: `${t.excel_title} | ${t.brand}` }
}

export default async function ExcelPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng: rawLng } = await params
  const lng = (rawLng in { en: true, zh: true, ja: true, ms: true, vi: true } ? rawLng : 'en') as Locale
  return <ExcelWorkbook lng={lng} />
}