'use client'

import { usePathname, useRouter } from 'next/navigation'
import { getTranslations, type Locale } from '@/lib/translations'

const localeOptions: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '简体中文' },
  { value: 'ja', label: '日本語' },
]

export function LanguageSwitcher({ lng }: { lng: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const label = getTranslations(lng).language_select

  function changeLanguage(nextLng: Locale) {
    const localizedPath = pathname.replace(/^\/[^/]+/, `/${nextLng}`)
    router.push(localizedPath)
  }

  return (
    <label className="shrink-0">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={lng}
        onChange={(event) => changeLanguage(event.target.value as Locale)}
        className="h-9 max-w-[108px] cursor-pointer rounded-md border border-neutral-200 bg-white px-2 text-[11px] text-neutral-600 outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400 sm:max-w-none"
      >
        {localeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}