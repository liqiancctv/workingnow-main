import en from '@/app/i18n/locales/en.json'
import ja from '@/app/i18n/locales/ja.json'
import ms from '@/app/i18n/locales/ms.json'
import vi from '@/app/i18n/locales/vi.json'
import zh from '@/app/i18n/locales/zh.json'

export const localeMessages = { en, zh, ja, ms, vi } as const
export type Locale = keyof typeof localeMessages | 'zh-CN' | 'zh-TW'
export const languages = [...Object.keys(localeMessages), 'zh-CN', 'zh-TW'] as Locale[]

export function getTranslations(lng: string) {
  if (lng === 'zh-CN') return localeMessages.zh
  return lng in localeMessages ? localeMessages[lng as keyof typeof localeMessages] : localeMessages.en
}