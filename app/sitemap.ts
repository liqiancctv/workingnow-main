import type { MetadataRoute } from 'next'
import { getTools, getToolPath } from '@/data/tools'
import { productLocales } from '@/app/i18n/settings'

const baseUrl = 'https://workingnow.live'

export default function sitemap(): MetadataRoute.Sitemap {
  const productPages = productLocales.flatMap((locale) => [
    `/${locale}/home`,
    `/${locale}/meetings`,
    `/${locale}/tools`,
    `/${locale}/break`,
    `/${locale}/discover`,
    `/${locale}/about`,
    `/${locale}/privacy`,
    `/${locale}/terms`,
    ...getTools().map((tool) => getToolPath(tool, locale)),
  ])
  const legacyHomePages = ['en', 'zh', 'ja', 'ms', 'vi'].map((locale) => `/${locale}`)

  return [...new Set([...productPages, ...legacyHomePages])].map((path) => ({
    url: new URL(path, baseUrl).toString(),
    changeFrequency: path.endsWith('/home') ? 'weekly' : 'monthly',
    priority: path.endsWith('/home') ? 1 : path.split('/').filter(Boolean).length === 2 ? 0.8 : 0.6,
  }))
}
