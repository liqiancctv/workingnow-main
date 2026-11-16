export const fallbackLng = 'en'
export const productLocales = ['en', 'zh-CN', 'zh-TW', 'ja'] as const
export type ProductLocale = (typeof productLocales)[number]

export function isProductLocale(locale: string): locale is ProductLocale {
  return (productLocales as readonly string[]).includes(locale)
}

export const legacyLanguages = ['en', 'zh', 'ja', 'ms', 'vi'] as const
export const languages = [...new Set([...legacyLanguages, ...productLocales])]
export const defaultNS = 'translation'

export function detectProductLocale(acceptLanguage: string | null): ProductLocale {
  const preferences = (acceptLanguage ?? '')
    .split(',')
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().split(';')
      const quality = parameters.find((parameter) => parameter.trim().startsWith('q='))
      const weight = quality ? Number(quality.trim().slice(2)) : 1
      return { tag: tag.toLowerCase(), weight, index }
    })
    .filter((entry) => entry.tag && Number.isFinite(entry.weight) && entry.weight > 0)
    .sort((left, right) => right.weight - left.weight || left.index - right.index)

  for (const { tag } of preferences) {
    if (tag === '*') continue
    if (tag === 'zh-tw' || tag === 'zh-hk' || tag === 'zh-mo' || tag.includes('hant')) return 'zh-TW'
    if (tag === 'zh' || tag.startsWith('zh-')) return 'zh-CN'
    if (tag === 'ja' || tag.startsWith('ja-')) return 'ja'
    if (tag === 'en' || tag.startsWith('en-')) return 'en'
  }
  return fallbackLng
}

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}