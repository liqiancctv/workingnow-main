import type { ReactNode } from 'react'

export function InlineNotice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' }) {
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`rounded-lg px-3 py-2 text-sm ${tone === 'error' ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
      {children}
    </p>
  )
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
