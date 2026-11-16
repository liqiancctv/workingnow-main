'use client'

import Link from 'next/link'
import { useProductLocale, useProductText } from './product-i18n-provider'

export function SiteFooter() {
  const locale = useProductLocale()
  const t = useProductText()
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>{t('footer.tagline')}</p>
        <nav aria-label={t('nav.legal')} className="flex gap-5">
          <Link className="hover:text-slate-900" href={`/${locale}/about`}>{t('footer.about')}</Link>
          <Link className="hover:text-slate-900" href={`/${locale}/privacy`}>{t('footer.privacy')}</Link>
          <Link className="hover:text-slate-900" href={`/${locale}/terms`}>{t('footer.terms')}</Link>
        </nav>
      </div>
    </footer>
  )
}
