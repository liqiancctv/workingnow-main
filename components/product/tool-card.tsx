import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { getLocalizedTool, getToolPath, type ToolDefinition } from '@/data/tools'
import { getProductText } from '@/lib/product-i18n'
import type { ProductLocale } from '@/app/i18n/settings'

export function ToolCard({ tool, locale = 'en' }: { tool: ToolDefinition; locale?: ProductLocale }) {
  const localized = getLocalizedTool(tool, locale)
  const minutes = getProductText(locale, 'tool.minutes', { count: Number.parseInt(tool.estimatedUsageTime, 10) })
  const Icon = tool.icon
  return (
    <Link href={getToolPath(tool, locale)} className="group flex min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <span className="mb-4 grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
        <Icon size={21} strokeWidth={1.8} />
      </span>
      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold text-slate-900">{localized.name}</span>
        <ArrowUpRight size={16} className="shrink-0 text-slate-400 transition group-hover:text-indigo-600" />
      </span>
      <span className="mt-2 flex-1 text-sm leading-6 text-slate-600">{localized.description}</span>
      <span className="mt-4 flex items-center gap-1.5 text-xs text-slate-400"><Clock3 size={13} />{minutes}</span>
    </Link>
  )
}
