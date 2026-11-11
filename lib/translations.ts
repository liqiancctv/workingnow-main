import en from '@/app/i18n/locales/en.json'
import ja from '@/app/i18n/locales/ja.json'
import zh from '@/app/i18n/locales/zh.json'

export const localeMessages = { en, zh, ja } as const
export type Locale = keyof typeof localeMessages
export const languages = Object.keys(localeMessages) as Locale[]

export function getTranslations(lng: string) {
  return localeMessages[lng as Locale] ?? localeMessages.en
}