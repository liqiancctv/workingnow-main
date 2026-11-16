'use client'

import { Analytics } from '@vercel/analytics/next'
import { useState } from 'react'
import { useVersionedStore, writeStore } from '@/lib/storage/versioned-store'
import { useProductText } from './product-i18n-provider'

const STORAGE_KEY = 'workingnow:analytics-consent'
const STORAGE_VERSION = 1
const isConsent = (value: unknown): value is boolean | null => value === true || value === false || value === null

export function AnalyticsConsent() {
  const t = useProductText()
  const [snapshot, setConsent] = useVersionedStore<boolean | null>(STORAGE_KEY, STORAGE_VERSION, null, isConsent)
  const [choiceError, setChoiceError] = useState('')

  function choose(value: boolean) {
    if (snapshot.status === 'ready') {
      const result = setConsent(value)
      setChoiceError(result.ok ? '' : result.error)
      return
    }
    const result = writeStore(STORAGE_KEY, STORAGE_VERSION, value)
    setChoiceError(result.ok ? '' : result.error)
  }

  return (
    <>
      {snapshot.value === true && (
        <Analytics beforeSend={(event) => {
          try {
            const url = new URL(event.url, window.location.origin)
            return { ...event, url: `${url.origin}${url.pathname}` }
          } catch {
            return null
          }
        }} />
      )}
      {snapshot.status === 'ready' && snapshot.value === null && (
        <aside role="dialog" aria-label={t('analytics.title')} className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:inset-x-6 sm:flex sm:items-center sm:gap-6 sm:p-5">
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">{t('analytics.title')}</h2>
            <p className="mt-1 text-sm leading-5 text-slate-600">{t('analytics.description')}</p>
          </div>
          <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
            <button type="button" onClick={() => choose(false)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">{t('analytics.decline')}</button>
            <button type="button" onClick={() => choose(true)} className="min-h-10 rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-700">{t('analytics.allow')}</button>
          </div>
        </aside>
      )}
      {choiceError && <p role="alert" className="fixed bottom-3 right-3 z-[60] rounded-lg bg-rose-100 p-3 text-sm text-rose-900">{choiceError}</p>}
      {snapshot.error && snapshot.value === null && (
        <aside role="alert" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl bg-rose-100 p-4 text-sm text-rose-900">
          <p>{snapshot.error}</p>
          <p>{t('analytics.error')}</p>
          <button type="button" onClick={() => choose(false)} className="mt-2 rounded-md border border-rose-300 px-3 py-1.5 font-medium">{t('analytics.reset')}</button>
        </aside>
      )}
    </>
  )
}
