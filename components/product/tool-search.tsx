'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { getLocalizedTool, getToolPath, tools } from '@/data/tools'
import { trackProductEvent } from '@/lib/analytics/events'
import { useProductLocale, useProductText } from './product-i18n-provider'

export function ToolSearch() {
  const locale = useProductLocale()
  const t = useProductText()
  const [query, setQuery] = useState('')
  useEffect(() => {
    if (!query.trim()) return
    const timer = window.setTimeout(() => trackProductEvent('tool_search'), 700)
    return () => window.clearTimeout(timer)
  }, [query])
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return []
    return tools.filter((tool) =>
      [getLocalizedTool(tool, locale).name, getLocalizedTool(tool, locale).description, ...tool.keywords]
        .some((value) => value.toLocaleLowerCase().includes(normalized)),
    ).slice(0, 8)
  }, [query, locale])

  return (
    <section id="tool-search" className="mt-14 scroll-mt-24" aria-labelledby="tool-search-title">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">{t('home.searchEyebrow')}</p>
        <h2 id="tool-search-title" className="mt-2 text-2xl font-semibold tracking-tight">{t('home.searchTitle')}</h2>
      </div>
      <label className="mt-5 flex max-w-2xl items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
        <Search size={18} className="shrink-0 text-slate-400" />
        <span className="sr-only">{t('common.searchTools')}</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('common.searchPlaceholder')}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>
      {query.trim() && (
        <div className="mt-3 max-w-2xl rounded-xl border border-slate-200 bg-white p-2" aria-live="polite">
          {results.length
            ? <ul>{results.map((tool) => {
              const localized = getLocalizedTool(tool, locale)
              return <li key={tool.id}><Link href={getToolPath(tool, locale)} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"><span><span className="font-medium">{localized.name}</span><span className="ml-2 text-xs text-slate-500">{localized.description}</span></span><span className="ml-3 text-xs capitalize text-indigo-700">{t(`category.${tool.category}`)}</span></Link></li>
            })}</ul>
            : <p className="px-3 py-3 text-sm text-slate-500">{t('common.noMatches')}</p>}
        </div>
      )}
    </section>
  )
}
