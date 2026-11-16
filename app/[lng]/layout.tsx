import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations, languages, type Locale } from '@/lib/translations'
import { DemoModeProvider } from '@/components/demo-mode'
import { notFound } from 'next/navigation'
import { ProductI18nProvider } from '@/components/product/product-i18n-provider'
import { detectProductLocale, isProductLocale, productLocales, type ProductLocale } from '@/app/i18n/settings'
import { AnalyticsConsent } from '@/components/product/analytics-consent'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return {
    title: `${t.home_title} | ${t.brand}`,
    description: t.home_description,
  }
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ lng: string }> }) {
  const { lng } = await params
  if (!languages.includes(lng as Locale) && !isProductLocale(lng)) notFound()
  const locale: ProductLocale = isProductLocale(lng)
    ? lng
    : lng === 'zh'
      ? 'zh-CN'
      : productLocales.includes(lng as ProductLocale)
        ? lng as ProductLocale
        : detectProductLocale(lng)
  return <ProductI18nProvider locale={locale}><DemoModeProvider>{children}<AnalyticsConsent /></DemoModeProvider></ProductI18nProvider>
}