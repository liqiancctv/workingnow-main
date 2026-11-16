'use client'

import { track } from '@vercel/analytics'

export type ProductEvent =
  | 'tool_open'
  | 'tool_use'
  | 'tool_complete'
  | 'tool_copy'
  | 'tool_favorite'
  | 'tool_search'
  | 'game_start'
  | 'game_complete'
  | 'break_start'
  | 'discover_view'

export type ProductEventProperties = {
  tool_id?: string
  tool_category?: 'meetings' | 'tools' | 'break' | 'discover'
  game_id?: string
  content_id?: string
  duration_seconds?: number
  entry_source?: 'home' | 'category' | 'related' | 'direct'
}

const CONSENT_KEY = 'workingnow:analytics-consent'

export function trackProductEvent(name: ProductEvent, properties: ProductEventProperties = {}) {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY)
    if (!saved) return
    const parsed: unknown = JSON.parse(saved)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('version' in parsed) ||
      !('value' in parsed) ||
      parsed.version !== 1 ||
      parsed.value !== true
    ) return
    track(name, properties)
  } catch (error) {
    console.warn('Product analytics event was not sent because consent could not be verified.', error)
  }
}
