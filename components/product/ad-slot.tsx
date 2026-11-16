'use client'

'use client'

import { useProductLocale } from './product-i18n-provider'
import { translateProductPhrase } from '@/lib/product-i18n'

export type AdPlacement = 'home-inline' | 'category-inline' | 'content-footer'

const placements: Record<AdPlacement, { label: string; enabled: boolean }> = {
  'home-inline': { label: 'Home content slot', enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' },
  'category-inline': { label: 'Category content slot', enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' },
  'content-footer': { label: 'Content footer slot', enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' },
}

export function AdSlot({ placement }: { placement: AdPlacement }) {
  const locale = useProductLocale()
  const t = (source: string, values?: Record<string, string | number>) => translateProductPhrase(locale, source, values)
  const config = placements[placement]
  if (!config.enabled) return null
  return (
    <aside aria-label={t('Advertisement')} className="my-8 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
      {t('Advertisement placeholder — {label}', { label: t(config.label) })}
    </aside>
  )
}
