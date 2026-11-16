'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type StoreStatus = 'loading' | 'ready' | 'unavailable' | 'invalid'
export type StoreSnapshot<T> = { value: T; status: StoreStatus; error?: string }

type VersionedValue<T> = { version: number; value: T }
export type StoreValidator<T> = (value: unknown) => value is T

const listeners = new Map<string, Set<() => void>>()

export function readStore<T>(key: string, version: number, fallback: T, validate?: StoreValidator<T>): StoreSnapshot<T> {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return { value: fallback, status: 'ready' }
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('version' in parsed) ||
      !('value' in parsed) ||
      typeof parsed.version !== 'number'
    ) {
      return { value: fallback, status: 'invalid', error: 'Saved data has an unsupported format.' }
    }

    const stored = parsed as VersionedValue<unknown>
    if (stored.version !== version) {
      return { value: fallback, status: 'invalid', error: 'Saved data needs a newer migration.' }
    }
    if (validate && !validate(stored.value)) {
      return { value: fallback, status: 'invalid', error: 'Saved data does not match the expected format.' }
    }
    return { value: stored.value as T, status: 'ready' }
  } catch (error) {
    return {
      value: fallback,
      status: 'unavailable',
      error: error instanceof Error ? error.message : 'Browser storage is unavailable.',
    }
  }
}

export function writeStore<T>(key: string, version: number, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify({ version, value } satisfies VersionedValue<T>))
    listeners.get(key)?.forEach((listener) => listener())
    return { ok: true as const }
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Unable to save data in browser storage.',
    }
  }
}

export function subscribeStore(key: string, listener: () => void) {
  const keyListeners = listeners.get(key) ?? new Set<() => void>()
  keyListeners.add(listener)
  listeners.set(key, keyListeners)
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    keyListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useVersionedStore<T>(key: string, version: number, fallback: T, validate?: StoreValidator<T>) {
  const fallbackRef = useRef(fallback)
  const validateRef = useRef(validate)
  const [snapshot, setSnapshot] = useState<StoreSnapshot<T>>({ value: fallback, status: 'loading' })

  useEffect(() => {
    setSnapshot(readStore(key, version, fallbackRef.current, validateRef.current))
  }, [key, version])

  useEffect(() => subscribeStore(key, () => {
    setSnapshot(readStore(key, version, fallbackRef.current, validateRef.current))
  }), [key, version])

  const setValue = useCallback((nextValue: T | ((current: T) => T)) => {
    if (snapshot.status !== 'ready') {
      return {
        ok: false as const,
        error: snapshot.error ?? 'Saved data is not ready; refusing to overwrite it.',
      }
    }
    const value = typeof nextValue === 'function'
      ? (nextValue as (current: T) => T)(snapshot.value)
      : nextValue
    const result = writeStore(key, version, value)
    if (result.ok) {
      setSnapshot({ value, status: 'ready' })
    } else {
      setSnapshot((current) => ({ ...current, status: 'unavailable', error: result.error }))
    }
    return result
  }, [key, snapshot, version])

  return [snapshot, setValue] as const
}
