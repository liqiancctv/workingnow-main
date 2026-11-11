import { Check, ChevronDown, Cloud, FileSpreadsheet, Filter, Search, Share2, Sigma } from 'lucide-react'
import type { Metadata } from 'next'
import { StealthNav } from '@/components/stealth-nav'
import { getTranslations, type Locale } from '@/lib/translations'

const rows = [
  { region: 'North America', revenue: '$4,820,000', costs: '$3,112,000', margin: '35.4%', variance: '+3.8%', status: 'excel_on_track' },
  { region: 'Western Europe', revenue: '$3,460,000', costs: '$2,318,000', margin: '33.0%', variance: '+1.2%', status: 'excel_on_track' },
  { region: 'Asia Pacific', revenue: '$2,940,000', costs: '$2,116,000', margin: '28.0%', variance: '-0.6%', status: 'excel_review_status' },
  { region: 'Latin America', revenue: '$1,280,000', costs: '$884,000', margin: '30.9%', variance: '+2.1%', status: 'excel_on_track' },
  { region: 'Middle East', revenue: '$960,000', costs: '$701,000', margin: '27.0%', variance: '-1.4%', status: 'excel_review_status' },
  { region: 'Central Europe', revenue: '$1,540,000', costs: '$1,004,000', margin: '34.8%', variance: '+4.2%', status: 'excel_on_track' },
] as const

const columns = ['A', 'B', 'C', 'D', 'E', 'F']

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return { title: `${t.excel_title} | ${t.brand}` }
}

export default async function ExcelPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng: rawLng } = await params
  const lng = (rawLng in { en: true, zh: true, ja: true } ? rawLng : 'en') as Locale
  const t = getTranslations(lng)
  const headers = [t.excel_region, t.excel_revenue, t.excel_costs, t.excel_margin, t.excel_variance, t.excel_status]
  const ribbons = [t.excel_home, t.excel_insert, t.excel_layout, t.excel_formulas, t.excel_data, t.excel_review, t.excel_view]

  return (
    <main className="flex h-dvh min-h-[520px] flex-col overflow-hidden bg-[#f4f6f7] text-[#202124]">
      <StealthNav lng={lng} active="excel" />
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#e1e5e8] bg-white px-4">
        <div className="flex min-w-0 items-center gap-2"><FileSpreadsheet size={19} className="shrink-0 text-[#217346]" /><span className="truncate text-xs font-medium text-neutral-700">{t.excel_book}</span><span className="hidden text-xs text-neutral-400 sm:inline">· {t.excel_updated}</span><Cloud size={14} className="hidden text-neutral-400 sm:block" /></div>
        <div className="flex items-center gap-2"><button title={t.excel_share} className="hidden items-center gap-2 rounded-md bg-[#217346] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#185c37] sm:flex"><Share2 size={13} />{t.excel_share}</button><button aria-label={t.excel_search} title={t.excel_search} className="grid size-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"><Search size={16} /></button></div>
      </header>

      <nav className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-[#e1e5e8] bg-white px-3">{ribbons.map((label, index) => <button key={label} className={`shrink-0 px-3 py-2 text-xs ${index === 0 ? 'border-b-2 border-[#217346] font-semibold text-[#217346]' : 'text-neutral-600 hover:bg-neutral-50'}`}>{label}</button>)}</nav>

      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[#e1e5e8] bg-white px-3 text-xs text-neutral-600">
        <button className="rounded px-2 py-1 hover:bg-neutral-100">Calibri <ChevronDown size={11} className="ml-1 inline" /></button><button className="rounded px-2 py-1 hover:bg-neutral-100">11 <ChevronDown size={11} className="ml-1 inline" /></button><span className="mx-1 h-5 border-l border-neutral-200" /><button aria-label={t.excel_bold} title={t.excel_bold} className="rounded px-2 py-1 font-bold hover:bg-neutral-100">B</button><button aria-label={t.excel_italic} title={t.excel_italic} className="rounded px-2 py-1 italic hover:bg-neutral-100">I</button><button aria-label={t.excel_underline} title={t.excel_underline} className="rounded px-2 py-1 underline hover:bg-neutral-100">U</button><span className="mx-1 h-5 border-l border-neutral-200" /><button aria-label={t.excel_filter} title={t.excel_filter} className="rounded px-2 py-1 hover:bg-neutral-100"><Filter size={14} /></button><button aria-label={t.excel_sum} title={t.excel_sum} className="rounded px-2 py-1 hover:bg-neutral-100"><Sigma size={15} /></button><span className="ml-auto hidden items-center gap-1.5 text-[10px] text-neutral-400 sm:flex"><Check size={12} className="text-[#217346]" />{t.excel_updated}</span>
      </div>

      <div className="flex h-9 shrink-0 items-center border-b border-[#d6dbe0] bg-white text-xs">
        <div className="flex h-full w-16 shrink-0 items-center justify-center border-r border-[#d6dbe0] font-mono text-neutral-500">B3</div><span className="px-3 text-neutral-400">fx</span><div className="truncate border-l border-[#d6dbe0] pl-3 font-mono text-neutral-700">=SUM(B2:B7)</div><span className="ml-auto hidden pr-4 text-neutral-400 sm:block">{t.excel_sum}</span>
      </div>

      <section className="min-h-0 flex-1 overflow-auto bg-white" aria-label={t.excel_title}>
        <div className="min-w-[1050px]">
          <div className="sticky top-0 z-10 grid grid-cols-[44px_220px_160px_160px_145px_145px_150px] border-b border-[#d6dbe0] bg-[#f3f5f6] text-center font-mono text-[11px] text-neutral-500">{columns.map((column) => <div key={column} className="border-r border-[#d6dbe0] py-1.5">{column}</div>)}</div>
          <div className="grid grid-cols-[44px_220px_160px_160px_145px_145px_150px] text-xs">
            <div className="border-r border-[#d6dbe0] bg-[#f3f5f6] py-2 text-center font-mono text-[11px] text-neutral-500">1</div>
            <div className="col-span-6 flex items-center justify-between border-b border-[#dfe5e1] bg-[#f1f7f2] px-4 py-2.5"><h1 className="font-semibold text-[#244b33]">{t.excel_title}</h1><span className="font-mono text-[10px] text-[#64806b]">FY 2026　·　USD</span></div>

            <div className="border-r border-[#d6dbe0] bg-[#f3f5f6] py-2 text-center font-mono text-[11px] text-neutral-500">2</div>
            {headers.map((header) => <div key={header} className="border-b border-r border-[#d6dbe0] bg-[#e8f0ea] px-3 py-2.5 font-semibold text-[#294c35]">{header}</div>)}

            {rows.map((row, index) => <div key={row.region} className="contents">
              <div className="border-r border-b border-[#e5e8eb] bg-[#f3f5f6] py-2.5 text-center font-mono text-[11px] text-neutral-500">{index + 3}</div>
              <div className="border-r border-b border-[#e5e8eb] px-3 py-2.5 font-medium text-neutral-700">{row.region}</div>
              <div className={`border-r border-b border-[#e5e8eb] px-3 py-2.5 text-right font-mono ${index === 0 ? 'outline outline-2 -outline-offset-2 outline-[#217346]' : ''}`}>{row.revenue}</div>
              <div className="border-r border-b border-[#e5e8eb] px-3 py-2.5 text-right font-mono">{row.costs}</div>
              <div className="border-r border-b border-[#e5e8eb] px-3 py-2.5 text-right font-mono">{row.margin}</div>
              <div className={`border-r border-b border-[#e5e8eb] px-3 py-2.5 text-right font-mono ${row.variance.startsWith('-') ? 'text-[#b5473c]' : 'text-[#217346]'}`}>{row.variance}</div>
              <div className="border-r border-b border-[#e5e8eb] px-3 py-2.5"><span className={`inline-flex items-center gap-1.5 ${row.status === 'excel_on_track' ? 'text-[#217346]' : 'text-[#a66a1f]'}`}><span className={`size-1.5 rounded-full ${row.status === 'excel_on_track' ? 'bg-[#2e8b57]' : 'bg-[#d19a3a]'}`} />{t[row.status]}</span></div>
            </div>)}

            <div className="border-r border-b border-[#d6dbe0] bg-[#f3f5f6] py-2.5 text-center font-mono text-[11px] text-neutral-500">9</div>
            <div className="border-r border-b border-[#d6dbe0] bg-[#f7f8f7] px-3 py-2.5 font-semibold">{t.excel_total}</div>
            <div className="border-r border-b border-[#d6dbe0] bg-[#f7f8f7] px-3 py-2.5 text-right font-mono font-semibold">$15,000,000</div>
            <div className="border-r border-b border-[#d6dbe0] bg-[#f7f8f7] px-3 py-2.5 text-right font-mono font-semibold">$10,135,000</div>
            <div className="border-r border-b border-[#d6dbe0] bg-[#f7f8f7] px-3 py-2.5 text-right font-mono font-semibold">32.4%</div>
            <div className="border-r border-b border-[#d6dbe0] bg-[#f7f8f7] px-3 py-2.5 text-right font-mono font-semibold text-[#217346]">+2.6%</div>
            <div className="border-r border-b border-[#d6dbe0] bg-[#f7f8f7] px-3 py-2.5 text-[#217346]">6 regions</div>
          </div>
        </div>
      </section>

      <footer className="flex h-9 shrink-0 items-center gap-5 border-t border-[#d6dbe0] bg-[#f5f6f7] px-4 text-xs"><span className="border-b-2 border-[#217346] px-2 py-2 font-medium text-[#217346]">{t.excel_sheet}</span><button aria-label={t.excel_add_sheet} title={t.excel_add_sheet} className="text-base text-neutral-500 hover:text-[#217346]">+</button><span className="ml-auto hidden text-[10px] text-neutral-400 sm:block">READY　　100%</span></footer>
    </main>
  )
}