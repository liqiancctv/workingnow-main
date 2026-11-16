import type { ReactNode } from 'react'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div data-theme-root className="flex min-h-dvh flex-col bg-slate-50 text-slate-950">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}
