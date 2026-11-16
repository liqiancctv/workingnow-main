'use client'

import { useEffect, useRef } from 'react'
import { useVersionedStore } from '@/lib/storage/versioned-store'
import { trackProductEvent } from '@/lib/analytics/events'
import { InlineNotice } from './feedback'
import type { ToolCategory } from '@/data/tools'

const STORAGE_KEY = 'workingnow:recent-tools'
const STORAGE_VERSION = 1
const EMPTY_IDS: string[] = []
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

export function ToolEngagement({ toolId, category }: { toolId: string; category: ToolCategory }) {
  const [snapshot, setRecent] = useVersionedStore(STORAGE_KEY, STORAGE_VERSION, EMPTY_IDS, isStringArray)
  const lastRecorded = useRef('')

  useEffect(() => {
    if (snapshot.status !== 'ready' || lastRecorded.current === toolId) return
    lastRecorded.current = toolId
    setRecent((current) => [toolId, ...current.filter((id) => id !== toolId)].slice(0, 8))
    trackProductEvent('tool_open', { tool_id: toolId, tool_category: category, entry_source: 'direct' })
    if (category === 'discover') trackProductEvent('discover_view', { content_id: toolId })
  }, [category, setRecent, snapshot.status, toolId])

  return snapshot.error ? <InlineNotice tone="error">{snapshot.error}</InlineNotice> : null
}
