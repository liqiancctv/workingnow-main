import Link from 'next/link'
import { Bot, Code2, FileSpreadsheet, House, Mail, Sparkles } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/translations'
import { LanguageSwitcher } from '@/components/language-switcher'

type ModuleId = 'home' | 'ai' | 'code' | 'excel' | 'outlook'

export function StealthNav({ lng, active }: { lng: Locale; active: ModuleId }) {
  const t = getTranslations(lng)
  const items = [
    { id: 'home' as const, href: `/${lng}`, label: t.nav_home, icon: House },
    { id: 'ai' as const, href: `/${lng}/ai-workspace`, label: t.nav_ai, icon: Bot },
    { id: 'code' as const, href: `/${lng}/vscode`, label: t.nav_code, icon: Code2 },
    { id: 'excel' as const, href: `/${lng}/excel`, label: t.nav_excel, icon: FileSpreadsheet },
    { id: 'outlook' as const, href: `/${lng}/outlook`, label: t.nav_outlook, icon: Mail },
  ]

  return (
    <header className="relative z-10 flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-3 backdrop-blur sm:px-6">
      <Link href={`/${lng}`} className="flex shrink-0 items-center gap-2 text-sm font-semibold text-neutral-900" aria-label={t.brand}>
        <span className="grid size-7 place-items-center rounded-md bg-neutral-900 text-white"><Sparkles size={14} /></span>
        <span className="hidden sm:inline">{t.brand}</span>
      </Link>
      <nav aria-label={t.nav_title} className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
        {items.map(({ id, href, label, icon: Icon }) => (
          <Link
            key={id}
            href={href}
            aria-current={active === id ? 'page' : undefined}
            title={label}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-xs transition sm:px-3 ${active === id ? 'bg-neutral-100 font-semibold text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <Icon size={15} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <LanguageSwitcher lng={lng} />
    </header>
  )
}