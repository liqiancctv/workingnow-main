import en from '@/app/i18n/locales/en.json'
import ja from '@/app/i18n/locales/ja.json'
import ms from '@/app/i18n/locales/ms.json'
import vi from '@/app/i18n/locales/vi.json'
import zh from '@/app/i18n/locales/zh.json'

export const localeMessages = { en, zh, ja, ms, vi } as const
export type Locale = keyof typeof localeMessages
export const languages = Object.keys(localeMessages) as Locale[]

export function getTranslations(lng: string) {
  return localeMessages[lng as Locale] ?? localeMessages.en
}