import Link from 'next/link'
import type { ReactNode } from 'react'
import { AppShell } from './app-shell'
import { FavoriteButton } from './favorite-button'
import { PageHeading } from './page-heading'
import { ToolCard } from './tool-card'
import { ToolEngagement } from './tool-engagement'
import { getTools, type ToolDefinition } from '@/data/tools'
import { getLocalizedTool, getToolPath } from '@/data/tools'
import { getProductText } from '@/lib/product-i18n'
import type { ProductLocale } from '@/app/i18n/settings'

function breadcrumbStructuredData(tool: ToolDefinition, locale: ProductLocale) {
  const localized = getLocalizedTool(tool, locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: getProductText(locale, 'detail.home'), item: `https://workingnow.live/${locale}/home` },
      { '@type': 'ListItem', position: 2, name: getProductText(locale, `category.${tool.category}` as Parameters<typeof getProductText>[1]), item: `https://workingnow.live/${locale}/${tool.category}` },
      { '@type': 'ListItem', position: 3, name: localized.name, item: `https://workingnow.live${getToolPath(tool, locale)}` },
    ],
  }
}

function applicationStructuredData(tool: ToolDefinition, locale: ProductLocale) {
  const localized = getLocalizedTool(tool, locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: localized.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    description: localized.description,
    url: `https://workingnow.live${getToolPath(tool, locale)}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}

export function ToolDetail({ tool, locale = 'en', children }: { tool: ToolDefinition; locale?: ProductLocale; children: ReactNode }) {
  const localized = getLocalizedTool(tool, locale)
  const categoryName = getProductText(locale, `category.${tool.category}` as Parameters<typeof getProductText>[1])
  const t = <K extends Parameters<typeof getProductText>[1]>(key: K, values?: Record<string, string | number>) => getProductText(locale, key, values)
  const related = getTools(tool.category).filter((entry) => entry.id !== tool.id).slice(0, 3)
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData(tool, locale)).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationStructuredData(tool, locale)).replace(/</g, '\\u003c') }} />
        <nav aria-label={t('detail.breadcrumb')} className="mb-6 text-sm text-slate-500">
          <Link href={`/${locale}/home`} className="hover:text-indigo-700">{t('detail.home')}</Link>
          <span aria-hidden="true" className="px-2">/</span>
          <Link href={`/${locale}/${tool.category}`} className="hover:text-indigo-700">{categoryName}</Link>
          <span aria-hidden="true" className="px-2">/</span>
          <span aria-current="page" className="text-slate-700">{localized.name}</span>
        </nav>
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <PageHeading eyebrow={categoryName} title={localized.name} description={localized.description} />
          <FavoriteButton tool={{ id: tool.id, name: localized.name, category: tool.category }} />
        </div>
        <ToolEngagement toolId={tool.id} category={tool.category} />
        <section className="mt-7" aria-label={t('tool.detailTitle', { name: localized.name })}>{children}</section>
        <section className="mt-8 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
          <h2 className="font-semibold text-slate-900">{t('detail.howItWorks')}</h2>
          <p className="mt-1">{localized.description} {t('detail.privateNote')}</p>
        </section>
        {related.length > 0 && (
          <section className="mt-10" aria-labelledby="related-tools">
            <h2 id="related-tools" className="text-xl font-semibold">{t('detail.related')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => <ToolCard key={entry.id} tool={entry} locale={locale} />)}
            </div>
          </section>
        )}
      </main>
    </AppShell>
  )
}
