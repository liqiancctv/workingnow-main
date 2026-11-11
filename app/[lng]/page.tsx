import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, Bot, Code2, FileSpreadsheet, Mail, Activity } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/translations'
import { StealthNav } from '@/components/stealth-nav'
import { VisitorCounter } from '@/components/VisitorCounter'

type Props = { params: Promise<{ lng: string }> }

const workspaces = [
  { id: 'ai', href: 'ai-workspace', icon: Bot, title: 'home_ai_title', description: 'home_ai_description', role: 'home_ai_role', accent: 'bg-[#e6ede8] text-[#42634f]', signal: '01' },
  { id: 'code', href: 'vscode', icon: Code2, title: 'home_code_title', description: 'home_code_description', role: 'home_code_role', accent: 'bg-[#e6edf2] text-[#42657c]', signal: '02' },
  { id: 'excel', href: 'excel', icon: FileSpreadsheet, title: 'home_excel_title', description: 'home_excel_description', role: 'home_excel_role', accent: 'bg-[#e7efe6] text-[#4c7049]', signal: '03' },
  { id: 'outlook', href: 'outlook', icon: Mail, title: 'home_outlook_title', description: 'home_outlook_description', role: 'home_outlook_role', accent: 'bg-[#f3e9e4] text-[#805c4b]', signal: '04' },
] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return { title: `${t.home_title} | ${t.brand}`, description: t.home_description }
}

export default async function WorkspaceHome({ params }: Props) {
  const { lng: rawLng } = await params
  const lng = (rawLng in { en: true, zh: true, ja: true } ? rawLng : 'en') as Locale
  const t = getTranslations(lng)

  return (
    <main className="flex min-h-dvh flex-col bg-[#f7f8f6] text-neutral-900">
      <StealthNav lng={lng} active="home" />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-neutral-200 pb-7">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-[#667d6c]">{t.home_eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.home_title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">{t.home_description}</p>
          </div>
          <div className="flex items-center gap-2 pb-1 text-xs text-neutral-500"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" /><span className="relative inline-flex size-2 rounded-full bg-emerald-600" /></span>{t.home_status}</div>
        </div>

        <section className="pt-7" aria-labelledby="workspace-list">
          <div className="mb-4 flex items-center justify-between"><h2 id="workspace-list" className="text-xs font-semibold text-neutral-600">{t.home_recent}</h2><span className="font-mono text-[10px] text-neutral-400">04 WORKSPACES</span></div>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {workspaces.map(({ id, href, icon: Icon, title, description, role, accent, signal }) => (
              <Link key={id} href={`/${lng}/${href}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-white/70 sm:gap-5 sm:px-3">
                <span className={`grid size-11 place-items-center rounded-lg ${accent}`}><Icon size={20} strokeWidth={1.7} /></span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="text-base font-semibold">{t[title]}</span><span className="font-mono text-[9px] tracking-wide text-neutral-400">{role === 'home_ai_role' ? t.home_ai_role : role === 'home_code_role' ? t.home_code_role : role === 'home_excel_role' ? t.home_excel_role : t.home_outlook_role}</span></span>
                  <span className="mt-1 block text-sm text-neutral-500">{t[description]}</span>
                </span>
                <span className="flex items-center gap-3 text-neutral-400"><span className="hidden font-mono text-[10px] sm:inline">{signal}</span><span className="grid size-8 place-items-center rounded-full border border-neutral-200 transition group-hover:border-neutral-500 group-hover:bg-neutral-900 group-hover:text-white"><ArrowUpRight size={15} /></span></span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-10 text-[10px] text-neutral-400"><span className="flex items-center gap-1.5"><Activity size={12} />WORKINGNOW · PRIVATE WORKSPACE</span><VisitorCounter lng={lng} /><span>BUILD 2026.11</span></footer>
      </div>
    </main>
  )
}