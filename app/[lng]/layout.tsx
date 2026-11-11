import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from '@/lib/translations'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return {
    title: `${t.home_title} | ${t.brand}`,
    description: t.home_description,
  }
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return children
}