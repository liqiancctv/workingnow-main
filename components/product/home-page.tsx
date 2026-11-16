import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock3, Compass, Gamepad2, Wrench } from 'lucide-react'
import { PersonalTools } from './personal-tools'
import { ToolSearch } from './tool-search'
import { AdSlot } from './ad-slot'
import { ToolCard } from './tool-card'
import { getTools, type ToolCategory } from '@/data/tools'
import { getProductText } from '@/lib/product-i18n'
import type { ProductLocale } from '@/app/i18n/settings'
import { getLocalizedAlternates, getOpenGraphLocale } from '@/lib/seo/metadata'

const categories: { id: ToolCategory; titleKey: 'category.meetings' | 'category.tools' | 'category.break' | 'category.discover'; descriptionKey: 'home.meetingsDescription' | 'home.toolsDescription' | 'home.breakDescription' | 'home.discoverDescription'; href: string; icon: typeof Clock3 }[] = [
  { id: 'meetings', titleKey: 'category.meetings', descriptionKey: 'home.meetingsDescription', href: '/meetings', icon: Clock3 },
  { id: 'tools', titleKey: 'category.tools', descriptionKey: 'home.toolsDescription', href: '/tools', icon: Wrench },
  { id: 'break', titleKey: 'category.break', descriptionKey: 'home.breakDescription', href: '/break', icon: Gamepad2 },
  { id: 'discover', titleKey: 'category.discover', descriptionKey: 'home.discoverDescription', href: '/discover', icon: Compass },
]

export function createHomeMetadata(locale: ProductLocale): Metadata {
  const title = getProductText(locale, 'home.title')
  const description = getProductText(locale, 'home.description')
  return {
    title,
    description,
    alternates: getLocalizedAlternates(locale, '/home'),
    openGraph: { title: `WorkingNow — ${title}`, description, type: 'website', locale: getOpenGraphLocale(locale) },
  }
}

export function HomePage({ locale }: { locale: ProductLocale }) {
  const t = <K extends Parameters<typeof getProductText>[1]>(key: K) => getProductText(locale, key)
  const featured = ['world-clock', 'time-zone-converter', 'percentage-calculator', 'word-counter']
    .map((id) => getTools().find((tool) => tool.id === id))
    .filter((tool) => tool !== undefined)

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -right-20 -top-32 size-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">{t('home.eyebrow')}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{t('home.title')}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{t('home.description')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/meetings`} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-indigo-50">{t('home.meetingCta')} <ArrowRight size={16} /></Link>
            <Link href={`/${locale}/tools`} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900">{t('home.toolsCta')}</Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('home.categories')}>
        {categories.map(({ id, titleKey, descriptionKey, href, icon: Icon }) => (
          <Link key={id} href={`/${locale}${href}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-sm">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><Icon size={20} /></span>
            <h2 className="mt-4 font-semibold">{t(titleKey)}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t(descriptionKey)}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-700">{t('common.explore')} <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </section>

      <ToolSearch />

      <section className="mt-14" aria-labelledby="popular-tools">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">{t('home.favoritesEyebrow')}</p><h2 id="popular-tools" className="mt-2 text-2xl font-semibold tracking-tight">{t('home.favorites')}</h2></div>
          <Link href={`/${locale}/meetings`} className="text-sm font-medium text-indigo-700 hover:text-indigo-900">{t('home.allMeetings')}</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} />)}
        </div>
      </section>

      <AdSlot placement="home-inline" />
      <PersonalTools />

      <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold">{t('home.privateTitle')}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t('home.privateDescription')}</p>
      </section>
    </main>
  )
}
