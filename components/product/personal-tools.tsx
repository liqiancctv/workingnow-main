'use client'

import Link from 'next/link'
import { ArrowUpRight, Heart, History } from 'lucide-react'
import { getLocalizedTool, getTool, getToolPath } from '@/data/tools'
import { useVersionedStore } from '@/lib/storage/versioned-store'
import { InlineNotice } from './feedback'
import { useProductLocale, useProductText } from './product-i18n-provider'

const FAVORITES_KEY = 'workingnow:favorites'
const RECENTS_KEY = 'workingnow:recent-tools'
const VERSION = 1
const EMPTY_IDS: string[] = []
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

function ShortcutSection({ title, icon: Icon, ids, emptyText, locale }: { title: string; icon: typeof Heart; ids: string[]; emptyText: string; locale: ReturnType<typeof useProductLocale> }) {
  const entries = ids.map((id) => getTool('meetings', id) ?? getTool('tools', id) ?? getTool('break', id) ?? getTool('discover', id))
    .filter((tool) => tool !== undefined)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-label={title}>
      <h2 className="flex items-center gap-2 font-semibold"><Icon size={16} className="text-indigo-700" />{title}</h2>
      {entries.length === 0
        ? <p className="mt-3 text-sm text-slate-500">{emptyText}</p>
        : <ul className="mt-3 space-y-2">{entries.map((tool) => <li key={tool.id}><Link href={getToolPath(tool, locale)} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-700"><span>{getLocalizedTool(tool, locale).name}</span><ArrowUpRight size={14} /></Link></li>)}</ul>}
    </section>
  )
}

export function PersonalTools() {
  const locale = useProductLocale()
  const t = useProductText()
  const [favorites] = useVersionedStore(FAVORITES_KEY, VERSION, EMPTY_IDS, isStringArray)
  const [recent] = useVersionedStore(RECENTS_KEY, VERSION, EMPTY_IDS, isStringArray)
  return (
    <section className="mt-8">
      {(favorites.error || recent.error) && <InlineNotice tone="error">{favorites.error ?? recent.error}</InlineNotice>}
      <div className="grid gap-4 md:grid-cols-2">
        <ShortcutSection title={t('common.favorites')} icon={Heart} ids={favorites.value} emptyText={t('common.favoriteEmpty')} locale={locale} />
        <ShortcutSection title={t('common.recent')} icon={History} ids={recent.value} emptyText={t('common.recentEmpty')} locale={locale} />
      </div>
    </section>
  )
}
