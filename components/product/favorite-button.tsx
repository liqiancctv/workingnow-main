'use client'

import { Heart } from 'lucide-react'
import type { ToolDefinition } from '@/data/tools'
import { useVersionedStore } from '@/lib/storage/versioned-store'
import { InlineNotice } from './feedback'
import { trackProductEvent } from '@/lib/analytics/events'
import { useProductText } from './product-i18n-provider'

const STORAGE_KEY = 'workingnow:favorites'
const STORAGE_VERSION = 1
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

export function FavoriteButton({ tool, compact = false }: { tool: Pick<ToolDefinition, 'id' | 'name' | 'category'>; compact?: boolean }) {
  const t = useProductText()
  const [snapshot, setFavorites] = useVersionedStore<string[]>(STORAGE_KEY, STORAGE_VERSION, [], isStringArray)
  const isFavorite = snapshot.value.includes(tool.id)

  function toggle() {
    const result = setFavorites((current) => current.includes(tool.id)
      ? current.filter((id) => id !== tool.id)
      : [...current, tool.id])
    if (result.ok) trackProductEvent('tool_favorite', { tool_id: tool.id, tool_category: tool.category })
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? t('common.unfavorite') : t('common.favorite')}: ${tool.name}`}
        disabled={snapshot.status === 'loading' || snapshot.status === 'invalid' || snapshot.status === 'unavailable'}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm transition hover:bg-slate-50 ${compact ? 'size-10' : 'px-4 py-2.5'}`}
      >
        <Heart size={16} className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'} />
        {!compact && (isFavorite ? t('common.saved') : t('common.save'))}
      </button>
      {snapshot.error && <InlineNotice tone="error">{snapshot.error}</InlineNotice>}
    </div>
  )
}
