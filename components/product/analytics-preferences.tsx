'use client'

import { useVersionedStore, writeStore } from '@/lib/storage/versioned-store'
import { useState } from 'react'
import { useProductText } from './product-i18n-provider'

const STORAGE_KEY = 'workingnow:analytics-consent'
const STORAGE_VERSION = 1
const isConsent = (value: unknown): value is boolean | null => value === true || value === false || value === null

export function AnalyticsPreferences() {
  const t = useProductText()
  const [snapshot, setConsent] = useVersionedStore<boolean | null>(STORAGE_KEY, STORAGE_VERSION, null, isConsent)
  const [choiceError, setChoiceError] = useState('')
  const value = snapshot.value
  function choose(nextValue: boolean) {
    if (snapshot.status === 'ready') {
      const result = setConsent(nextValue)
      setChoiceError(result.ok ? '' : result.error)
      return
    }
    const result = writeStore(STORAGE_KEY, STORAGE_VERSION, nextValue)
    setChoiceError(result.ok ? '' : result.error)
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <p className="text-sm text-slate-600">
        {t('analytics.status')}: {value === true ? t('analytics.allowed') : value === false ? t('analytics.declined') : t('analytics.noChoice')}
      </p>
      <button type="button" onClick={() => choose(true)} className="min-h-10 rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white">{t('analytics.allow')}</button>
      <button type="button" onClick={() => choose(false)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700">{t('analytics.decline')}</button>
      {snapshot.error && <p role="alert" className="w-full text-sm text-rose-700">{snapshot.error}</p>}
      {choiceError && <p role="alert" className="w-full text-sm text-rose-700">{choiceError}</p>}
    </div>
  )
}
