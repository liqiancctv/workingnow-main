import { getLocalizedCategory, getTools, type ToolCategory } from '@/data/tools'
import { ToolCard } from './tool-card'
import { PageHeading } from './page-heading'
import { AdSlot } from './ad-slot'
import { getProductText } from '@/lib/product-i18n'
import type { ProductLocale } from '@/app/i18n/settings'

export function ToolListing({ category, locale = 'en' }: { category: ToolCategory; locale?: ProductLocale }) {
  const t = <K extends Parameters<typeof getProductText>[1]>(key: K) => getProductText(locale, key)
  const info = getLocalizedCategory(category, locale)
  const entries = getTools(category)
  const titleKey = `listing.${category}` as const
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading eyebrow={t('common.workingNow')} title={t(titleKey)} description={info.description} />
      <section aria-label={`${info.name} tools`} className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} />)}
      </section>
      <AdSlot placement="category-inline" />
    </main>
  )
}
