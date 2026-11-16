'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Clock3, Compass, Gamepad2, Search, Wrench } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { localeLabels } from '@/lib/product-i18n'
import { useProductLocale, useProductText } from './product-i18n-provider'

const navigation = [
  { href: '/meetings', key: 'nav.meetings' as const, icon: Clock3 },
  { href: '/tools', key: 'nav.tools' as const, icon: Wrench },
  { href: '/break', key: 'nav.break' as const, icon: Gamepad2 },
  { href: '/discover', key: 'nav.discover' as const, icon: Compass },
]

export function SiteHeader() {
  const locale = useProductLocale()
  const t = useProductText()
  const pathname = usePathname()
  const router = useRouter()
  const localizedPath = (path: string) => `/${locale}${path}`
  function changeLanguage(nextLocale: string) {
    const remainingPath = pathname.replace(/^\/[^/]+(?=\/|$)/, '')
    const nextPath = `/${nextLocale}${remainingPath || '/home'}`
    router.push(nextPath)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={localizedPath('/home')} className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-slate-950">
          <span className="grid size-8 place-items-center rounded-xl bg-indigo-600 text-sm text-white">W</span>
          <span className="hidden sm:inline">WorkingNow</span>
        </Link>
        <nav aria-label={t('nav.main')} className="flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto sm:gap-1">
          {navigation.map(({ href, key, icon: Icon }) => (
            <Link key={href} href={localizedPath(href)} aria-label={t(key)} title={t(key)} className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:px-3">
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{t(key)}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={localizedPath('/home#tool-search')} aria-label={t('nav.search')} className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
            <Search size={16} />
          </Link>
          <select
            aria-label={t('language.change')}
            value={locale}
            onChange={(event) => changeLanguage(event.target.value)}
            className="h-9 max-w-24 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 sm:max-w-none"
          >
            {Object.entries(localeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
