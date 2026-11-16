export function PageHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </div>
  )
}
