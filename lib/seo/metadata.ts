import type { Metadata } from 'next'
import type { ToolDefinition } from '@/data/tools'
import { getLocalizedTool } from '@/data/tools'
import { getProductText } from '@/lib/product-i18n'
import { productLocales, type ProductLocale } from '@/app/i18n/settings'

const SITE_URL = 'https://workingnow.live'

export function getLocalizedAlternates(locale: ProductLocale, path: string) {
  const localizedPath = (supportedLocale: ProductLocale) => `${SITE_URL}/${supportedLocale}${path}`
  return {
    canonical: localizedPath(locale),
    languages: Object.fromEntries(productLocales.map((supportedLocale) => [
      supportedLocale,
      localizedPath(supportedLocale),
    ])),
  }
}

export function getOpenGraphLocale(locale: ProductLocale) {
  return locale === 'zh-CN' ? 'zh_CN' : locale === 'zh-TW' ? 'zh_TW' : locale === 'ja' ? 'ja_JP' : 'en_US'
}

export function createToolMetadata(tool: ToolDefinition, locale: ProductLocale = 'en'): Metadata {
  const localized = getLocalizedTool(tool, locale)
  const path = `/${tool.category}/${tool.slug}`
  const url = `${SITE_URL}/${locale}${path}`
  return {
    title: localized.name,
    description: localized.description,
    alternates: getLocalizedAlternates(locale, path),
    openGraph: {
      title: localized.name,
      description: localized.description,
      url,
      siteName: 'WorkingNow',
      type: 'website',
      locale: getOpenGraphLocale(locale),
    },
    twitter: {
      card: 'summary',
      title: localized.name,
      description: localized.description,
    },
  }
}

export function createCategoryMetadata(locale: ProductLocale, category: ToolDefinition['category']): Metadata {
  const title = getProductText(locale, `listing.${category}` as Parameters<typeof getProductText>[1])
  const description = getProductText(locale, `category.${category}Description` as Parameters<typeof getProductText>[1])
  const path = `/${category}`
  const url = `${SITE_URL}/${locale}${path}`
  return {
    title,
    description,
    alternates: getLocalizedAlternates(locale, path),
    openGraph: { title, description, url, siteName: 'WorkingNow', type: 'website', locale: getOpenGraphLocale(locale) },
  }
}
