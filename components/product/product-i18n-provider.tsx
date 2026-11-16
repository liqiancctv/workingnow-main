'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ProductLocale } from '@/app/i18n/settings'
import { getProductText, type MessageKey } from '@/lib/product-i18n'

const ProductI18nContext = createContext<ProductLocale>('en')

export function ProductI18nProvider({ locale, children }: { locale: ProductLocale; children: ReactNode }) {
  const value = useMemo(() => locale, [locale])
  return <ProductI18nContext.Provider value={value}>{children}</ProductI18nContext.Provider>
}

export function useProductLocale() {
  return useContext(ProductI18nContext)
}

export function useProductText() {
  const locale = useProductLocale()
  return (key: MessageKey, values?: Record<string, string | number>) => getProductText(locale, key, values)
}
