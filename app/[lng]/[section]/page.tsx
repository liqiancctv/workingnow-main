import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/product/app-shell'
import { HomePage, createHomeMetadata } from '@/components/product/home-page'
import { ToolListing } from '@/components/product/tool-listing'
import { PageHeading } from '@/components/product/page-heading'
import { AnalyticsPreferences } from '@/components/product/analytics-preferences'
import { getProductText } from '@/lib/product-i18n'
import { createCategoryMetadata } from '@/lib/seo/metadata'
import { isProductLocale } from '@/app/i18n/settings'
import type { ProductLocale } from '@/app/i18n/settings'
import type { ToolCategory } from '@/data/tools'

type Props = { params: Promise<{ lng: string; section: string }> }
type LegalPage = 'about' | 'privacy' | 'terms'

const categories: ToolCategory[] = ['meetings', 'tools', 'break', 'discover']
const legalPages: LegalPage[] = ['about', 'privacy', 'terms']

function getLocale(value: string): ProductLocale {
  if (!isProductLocale(value)) notFound()
  return value
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng, section } = await params
  const locale = getLocale(lng)
  if (section === 'home') return createHomeMetadata(locale)
  if (categories.includes(section as ToolCategory)) return createCategoryMetadata(locale, section as ToolCategory)
  if (legalPages.includes(section as LegalPage)) {
    const key = `${section}.title` as Parameters<typeof getProductText>[1]
    const descriptionKey = `${section}.description` as Parameters<typeof getProductText>[1]
    return {
      title: getProductText(locale, key),
      description: getProductText(locale, descriptionKey),
      alternates: { canonical: `/${locale}/${section}` },
      openGraph: { title: getProductText(locale, key), description: getProductText(locale, descriptionKey), type: 'website' },
    }
  }
  return { title: getProductText(locale, '404.title') }
}

function LegalContent({ section, locale }: { section: LegalPage; locale: ProductLocale }) {
  const t = <K extends Parameters<typeof getProductText>[1]>(key: K) => getProductText(locale, key)
  if (section === 'about') return (
    <div className="mt-8 space-y-4 text-sm leading-7 text-slate-600"><p>{t('about.body1')}</p><p>{t('about.body2')}</p></div>
  )
  if (section === 'privacy') return (
    <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
      <section><h2 className="font-semibold text-slate-900">{t('privacy.inputTitle')}</h2><p className="mt-2">{t('privacy.inputBody')}</p></section>
      <section><h2 className="font-semibold text-slate-900">{t('privacy.storageTitle')}</h2><p className="mt-2">{t('privacy.storageBody')}</p></section>
      <section><h2 className="font-semibold text-slate-900">{t('privacy.analyticsTitle')}</h2><p className="mt-2">{t('privacy.analyticsBody')}</p><AnalyticsPreferences /></section>
      <section><h2 className="font-semibold text-slate-900">{t('privacy.adsTitle')}</h2><p className="mt-2">{t('privacy.adsBody')}</p></section>
      <section><h2 className="font-semibold text-slate-900">{t('privacy.contactTitle')}</h2><p className="mt-2">{t('privacy.contactBody')}</p></section>
    </div>
  )
  return (
    <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
      <section><h2 className="font-semibold text-slate-900">{t('terms.toolsTitle')}</h2><p className="mt-2">{t('terms.toolsBody')}</p></section>
      <section><h2 className="font-semibold text-slate-900">{t('terms.availabilityTitle')}</h2><p className="mt-2">{t('terms.availabilityBody')}</p></section>
      <section><h2 className="font-semibold text-slate-900">{t('terms.contentTitle')}</h2><p className="mt-2">{t('terms.contentBody')}</p></section>
    </div>
  )
}

export default async function LocalizedProductSection({ params }: Props) {
  const { lng, section } = await params
  const locale = getLocale(lng)
  if (section === 'home') return <AppShell><HomePage locale={locale} /></AppShell>
  if (categories.includes(section as ToolCategory)) {
    return <AppShell><ToolListing category={section as ToolCategory} locale={locale} /></AppShell>
  }
  if (!legalPages.includes(section as LegalPage)) notFound()
  const key = `${section}.title` as Parameters<typeof getProductText>[1]
  const descriptionKey = `${section}.description` as Parameters<typeof getProductText>[1]
  const eyebrowKey = `${section}.eyebrow` as Parameters<typeof getProductText>[1]
  return <AppShell><main className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><PageHeading eyebrow={getProductText(locale, eyebrowKey)} title={getProductText(locale, key)} description={getProductText(locale, descriptionKey)} /><LegalContent section={section as LegalPage} locale={locale} /></main></AppShell>
}
