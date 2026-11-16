export type AdPlacement = 'home-inline' | 'category-inline' | 'content-footer'

const placements: Record<AdPlacement, { label: string; enabled: boolean }> = {
  'home-inline': { label: 'Home content slot', enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' },
  'category-inline': { label: 'Category content slot', enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' },
  'content-footer': { label: 'Content footer slot', enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' },
}

export function AdSlot({ placement }: { placement: AdPlacement }) {
  const config = placements[placement]
  if (!config.enabled) return null
  return (
    <aside aria-label="Advertisement" className="my-8 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
      Advertisement placeholder — {config.label}
    </aside>
  )
}
