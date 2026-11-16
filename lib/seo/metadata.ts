import type { Metadata } from 'next'
import type { ToolDefinition } from '@/data/tools'
import { getLocalizedTool } from '@/data/tools'
import { getProductText } from '@/lib/product-i18n'
import { productLocales, type ProductLocale } from '@/app/i18n/settings'

const SITE_URL = 'https://workingnow.live'

export function createToolMetadata(tool: ToolDefinition, locale: ProductLocale = 'en'): Metadata {
  const localized = getLocalizedTool(tool, locale)
  const url = `${SITE_URL}/${locale}/${tool.category}/${tool.slug}`
  return {
    title: localized.name,
    description: localized.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(productLocales.map((supportedLocale) => [
        supportedLocale,
        `${SITE_URL}/${supportedLocale}/${tool.category}/${tool.slug}`,
      ])),
    },
    openGraph: {
      title: localized.name,
      description: localized.description,
      url,
      siteName: 'WorkingNow',
      type: 'website',
      locale: locale === 'zh-CN' ? 'zh_CN' : locale === 'zh-TW' ? 'zh_TW' : locale === 'ja' ? 'ja_JP' : 'en_US',
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
  const url = `${SITE_URL}/${locale}/${category}`
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(productLocales.map((supportedLocale) => [
        supportedLocale,
        `${SITE_URL}/${supportedLocale}/${category}`,
      ])),
    },
    openGraph: { title, description, url, siteName: 'WorkingNow', type: 'website' },
  }
}
