'use client'

import { useEffect, useState } from 'react'
import { getTranslations, type Locale } from '@/lib/translations'
import { StealthNav } from '@/components/stealth-nav'
import { useDemoStream } from '@/components/demo-mode'

export function VSCodeSkin({ lng }: { lng: Locale }) {
  const t = getTranslations(lng)
  const [tasks, setTasks] = useState<string[]>([])
  const demoStream = useDemoStream(t.demo_code_samples, 3200)

  useEffect(() => {
    let active = true
    fetch('/gossip.json')
      .then((response) => {
        if (!response.ok) throw new Error('Task feed unavailable')
        return response.json() as Promise<string[]>
      })
      .then((data) => { if (active) setTasks(data) })
      .catch(() => { if (active) setTasks([t.vscode_fallback]) })
    return () => { active = false }
  }, [t.vscode_fallback])

  const menuItems = [t.vscode_file, t.vscode_edit, t.vscode_selection, t.vscode_view, t.vscode_go, t.vscode_run, t.vscode_terminal, t.vscode_help]

  return (
    <main className="flex h-dvh min-h-[480px] flex-col overflow-hidden bg-[#1e1e1e] font-sans text-sm text-[#cccccc]">
      <StealthNav lng={lng} active="code" />
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#292929] bg-[#333333] px-3 text-xs text-[#dddddd]">
        <div className="flex min-w-0 items-center gap-3"><span className="font-bold text-[#58a6ff]">⨝</span><nav className="hidden items-center gap-1 xl:flex">{menuItems.map((item) => <span key={item} className="rounded px-2 py-1 hover:bg-[#505050]">{item}</span>)}</nav></div>
        <div className="mx-3 hidden w-full max-w-sm truncate rounded border border-[#454545] bg-[#2d2d2d] px-3 py-1 text-center text-[11px] text-[#aaaaaa] sm:block">workingnow-main — Index.tsx</div>
        <div className="flex shrink-0 items-center gap-2 text-[10px] text-[#9b9b9b]"><span className="rounded border border-sky-800 bg-sky-950/60 px-1.5 py-0.5 text-sky-300">{t.demo_badge}</span><span>{t.vscode_project}</span></div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-10 shrink-0 flex-col items-center gap-5 bg-[#333333] py-4 text-base text-[#858585] sm:w-12">
          <span className="w-full border-l-2 border-[#007acc] pl-2 text-white" title={t.vscode_explorer}>▤</span><span>⌕</span><span>⑂</span><span>◉</span><span className="mt-auto">⚙</span>
        </aside>
        <aside className="hidden w-56 shrink-0 flex-col border-r border-[#2b2b2b] bg-[#252526] text-xs sm:flex">
          <div className="flex items-center justify-between px-3 py-3 text-[10px] font-semibold tracking-wider text-[#bbbbbb]"><span>{t.vscode_explorer}</span><span>•••</span></div>
          <div className="space-y-1 px-2"><p className="font-semibold text-white">⌄　{t.vscode_project}</p><p className="pl-5 text-[#cccccc]">▸　app</p><p className="pl-8 text-[#cccccc]">▸　components</p><p className="bg-[#37373d] py-1 pl-11 font-medium text-[#75beff]">TSX　Index.tsx</p><p className="pl-8 text-[#cccccc]">CSS　globals.css</p><p className="pl-5 text-[#d7ba7d]">JS　package.json</p><p className="pl-5 text-[#9b9b9b]">◇　.gitignore</p></div>
          <div className="mt-auto border-t border-[#333333] px-3 py-2 text-[10px] text-[#858585]">{t.vscode_connected}</div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-[#1e1e1e]">
          <div className="flex h-9 shrink-0 items-center border-b border-[#1e1e1e] bg-[#2d2d2d] text-xs"><div className="flex h-full items-center gap-2 border-t border-[#007acc] bg-[#1e1e1e] px-4 text-white"><span className="text-[#75beff]">TSX</span><span>Index.tsx</span><span className="text-[#858585]">×</span></div></div>
          <div className="min-h-0 flex-1 overflow-auto py-4 font-mono text-[11px] leading-6 sm:text-xs">
            <div className="flex min-w-max"><span className="w-12 shrink-0 select-none pr-4 text-right text-[#858585]">1</span><p><span className="text-[#c586c0]">import</span> React <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&apos;react&apos;</span>;</p></div>
            <div className="flex min-w-max"><span className="w-12 shrink-0 select-none pr-4 text-right text-[#858585]">2</span><p><span className="text-[#569cd6]">const</span> <span className="text-[#dcdcaa]">GlobalMonitor</span> = () =&gt; {'{'}</p></div>
            <div className="flex min-w-max"><span className="w-12 shrink-0 select-none pr-4 text-right text-[#858585]">3</span><p className="text-[#6a9955]">&nbsp;&nbsp;// {t.vscode_connected}</p></div>
            {tasks.map((task, index) => <div key={`${index}-${task}`} className="flex min-w-max border-l-2 border-amber-500/40 bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"><span className="w-12 shrink-0 select-none pr-4 text-right text-[#858585]">{index + 4}</span><p className="max-w-[calc(100vw-100px)] truncate pr-6 text-[#ce9178]">&nbsp;&nbsp;&nbsp;&nbsp;&quot;{task}&quot;,</p></div>)}
            {demoStream.events.map((event, index) => <div key={event.id} className="flex min-w-max border-l-2 border-sky-500/50 bg-sky-500/[0.06]"><span className="w-12 shrink-0 select-none pr-4 text-right text-[#858585]">{tasks.length + index + 4}</span><p className="text-[#9cdcfe]">&nbsp;&nbsp;{event.item}</p></div>)}
            <div className="flex min-w-max"><span className="w-12 shrink-0 select-none pr-4 text-right text-[#858585]">{tasks.length + demoStream.events.length + 4}</span><p>&nbsp;&nbsp;<span className="text-[#c586c0]">return</span> &lt;<span className="text-[#569cd6]">div</span>&gt;Data Stream Synced&lt;/<span className="text-[#569cd6]">div</span>&gt;</p></div>
            <div className="flex min-w-max"><span className="w-12 shrink-0 select-none pr-4 text-right text-[#858585]">{tasks.length + demoStream.events.length + 5}</span><p>{'}'}; <span className="text-[#c586c0]">export default</span> <span className="text-[#dcdcaa]">GlobalMonitor</span>;</p></div>
          </div>
        </section>
      </div>

      <footer className="flex h-6 shrink-0 items-center justify-between bg-[#007acc] px-2 text-[10px] text-white sm:text-xs"><div className="flex items-center gap-3"><span className="font-semibold">⇄ main*</span><span>⊗ 0　⚠ 0</span></div><div className="flex items-center gap-3"><span className="hidden text-emerald-100 sm:inline">{demoStream.enabled ? `DEMO BUILD #${demoStream.tick}` : ''}</span><span>Ln 7, Col 42</span><span className="hidden sm:inline">Spaces: 2</span><span className="hidden sm:inline">UTF-8</span><span>TypeScript JSX</span></div></footer>
    </main>
  )
}