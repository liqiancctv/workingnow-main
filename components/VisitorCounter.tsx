'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'
import { getTranslations, type Locale } from '@/lib/translations'

type VisitHistory = {
  views: number
  paths: string[]
}

const storageKey = 'workingnow:tab-analytics:v1'
const storageEvent = 'workingnow:tab-analytics-change'
const emptyHistory = JSON.stringify({ views: 0, paths: [] })
let memorySnapshot = emptyHistory

function getSnapshot() {
  try {
    return sessionStorage.getItem(storageKey) ?? memorySnapshot
  } catch {
    return memorySnapshot
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(storageEvent, onChange)
  return () => window.removeEventListener(storageEvent, onChange)
}

function parseHistory(snapshot: string): VisitHistory {
  try {
    const parsed = JSON.parse(snapshot) as Partial<VisitHistory>
    return {
      views: typeof parsed.views === 'number' ? parsed.views : 0,
      paths: Array.isArray(parsed.paths) ? parsed.paths.filter((path): path is string => typeof path === 'string') : [],
    }
  } catch {
    return { views: 0, paths: [] }
  }
}

export function VisitorCounter({ lng }: { lng: Locale }) {
  const pathname = usePathname()
  const t = getTranslations(lng)
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => emptyHistory)
  const history = parseHistory(snapshot)

  useEffect(() => {
    const previous = parseHistory(getSnapshot())
    const next: VisitHistory = {
      views: previous.views + 1,
      paths: previous.paths.includes(pathname) ? previous.paths : [...previous.paths, pathname],
    }
    memorySnapshot = JSON.stringify(next)
    try {
      sessionStorage.setItem(storageKey, memorySnapshot)
    } catch {
      memorySnapshot = JSON.stringify(next)
    }
    window.dispatchEvent(new Event(storageEvent))
  }, [pathname])

  const numberLocale = lng === 'zh' ? 'zh-CN' : lng === 'ja' ? 'ja-JP' : 'en-US'
  const formatNumber = new Intl.NumberFormat(numberLocale)

  return (
    <div aria-label={t.counter_tab} className="flex items-center gap-3 text-[10px] text-neutral-400 sm:gap-4">
      <span>{t.counter_views}: <span className="font-mono tabular-nums text-neutral-600">{formatNumber.format(history.views)}</span></span>
      <span>{t.counter_routes}: <span className="font-mono tabular-nums text-neutral-600">{formatNumber.format(history.paths.length)}</span></span>
      <span className="hidden sm:inline">{t.counter_privacy}</span>
      <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700">{t.counter_dashboard}</a>
    </div>
  )
}