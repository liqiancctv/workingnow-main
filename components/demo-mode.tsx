'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type DemoModeValue = {
  enabled: boolean
  toggle: () => void
}

export type DemoStreamEvent<T> = {
  id: string
  item: T
  tick: number
}

const DemoModeContext = createContext<DemoModeValue | null>(null)

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [pausedPath, setPausedPath] = useState<string | null>(null)
  const isDemoRoute = /\/(ai-workspace|vscode|excel)$/.test(pathname)
  const enabled = isDemoRoute && pausedPath !== pathname
  const value = useMemo(() => ({
    enabled,
    toggle: () => setPausedPath((current) => current === pathname ? null : pathname),
  }), [enabled, pathname])

  useEffect(() => {
    function pauseDemo(event: KeyboardEvent) {
      if (event.key === 'Escape' && isDemoRoute) setPausedPath(pathname)
    }

    window.addEventListener('keydown', pauseDemo)
    return () => window.removeEventListener('keydown', pauseDemo)
  }, [isDemoRoute, pathname])

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (!context) throw new Error('useDemoMode must be used inside DemoModeProvider')
  return context
}

export function useDemoStream<T>(items: readonly T[], intervalMs = 4500) {
  const { enabled } = useDemoMode()
  const [stream, setStream] = useState<{ events: DemoStreamEvent<T>[]; tick: number }>({ events: [], tick: 0 })

  useEffect(() => {
    if (!enabled || items.length === 0) return

    const timer = window.setInterval(() => {
      setStream((current) => {
        const tick = current.tick + 1
        const item = items[(tick - 1) % items.length]
        return {
          tick,
          events: [...current.events.slice(-3), { id: `${Date.now()}-${tick}`, item, tick }],
        }
      })
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [enabled, intervalMs, items])

  return { enabled, ...stream }
}