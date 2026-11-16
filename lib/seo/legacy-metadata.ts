import type { Metadata } from 'next'
import { languages } from '@/lib/translations'

const BASE_URL = 'https://workingnow.live'

export function createLegacyMetadata(lng: string, path: string, title: string, description: string): Metadata {
  const canonicalPath = `/${lng}/${path}`.replace(/\/+$/, '') || `/${lng}`
  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries([
        ...languages.map((locale) => [locale, `${BASE_URL}/${locale}/${path}`]),
        ['x-default', `${BASE_URL}/en/${path}`],
      ]),
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonicalPath}`,
      siteName: 'WorkingNow',
      type: 'website',
      locale: lng === 'zh' ? 'zh_CN' : lng === 'ja' ? 'ja_JP' : lng === 'ms' ? 'ms_MY' : lng === 'vi' ? 'vi_VN' : 'en_US',
    },
    twitter: { card: 'summary', title, description },
  }
}
