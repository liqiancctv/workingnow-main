'use client'

import { Pause, Play } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/translations'
import { useDemoMode } from '@/components/demo-mode'

export function DemoModeToggle({ lng }: { lng: Locale }) {
  const { enabled, toggle } = useDemoMode()
  const t = getTranslations(lng)
  const label = enabled ? t.demo_pause : t.demo_start

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={enabled}
      title={`${label} · Esc ${t.demo_badge}`}
      onClick={toggle}
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-2 text-[10px] transition sm:px-2.5 ${enabled ? 'border-sky-200 bg-sky-50 text-sky-800' : 'border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'}`}
    >
      <span className={`size-1.5 rounded-full ${enabled ? 'animate-pulse bg-sky-500' : 'bg-neutral-300'}`} />
      <span className="font-medium">Demo</span>
      <span className="hidden sm:inline">{enabled ? t.demo_active : t.demo_idle}</span>
      <span className="hidden sm:inline">{enabled ? <Pause size={12} /> : <Play size={12} />}</span>
    </button>
  )
}