'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useVersionedStore } from '@/lib/storage/versioned-store'

const STORAGE_KEY = 'workingnow:theme'
const STORAGE_VERSION = 1
type Theme = 'light' | 'dark'
const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark'

export function ThemeToggle() {
  const [snapshot, setTheme] = useVersionedStore<Theme>(STORAGE_KEY, STORAGE_VERSION, 'light', isTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', snapshot.value === 'dark')
  }, [snapshot.value])

  const next = snapshot.value === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      disabled={snapshot.status === 'loading' || snapshot.status === 'invalid' || snapshot.status === 'unavailable'}
      aria-label={`Switch to ${next} theme`}
      title={snapshot.error}
      className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
    >
      {snapshot.value === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
