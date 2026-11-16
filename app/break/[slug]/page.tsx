import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/product/tool-detail'
import { getTool, getTools } from '@/data/tools'
import { BreakTool } from '@/features/break/break-tool'
import { isBreakSlug } from '@/features/break/logic'
import { createToolMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getTools('break').filter(({ slug }) => isBreakSlug(slug)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getTool('break', slug)
  return tool && isBreakSlug(slug) ? createToolMetadata(tool) : { title: 'Break tool not found' }
}

export default async function BreakPage({ params }: Props) {
  const { slug } = await params
  const tool = getTool('break', slug)
  if (!tool || !isBreakSlug(slug)) notFound()
  return <ToolDetail tool={tool}><BreakTool slug={slug} /></ToolDetail>
}
