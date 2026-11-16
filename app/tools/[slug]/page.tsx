import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/product/tool-detail'
import { getTool, getTools } from '@/data/tools'
import { WorkTool } from '@/features/work-tools/work-tools'
import { createToolMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getTools('tools').map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getTool('tools', slug)
  if (!tool) return { title: 'Work tool not found' }
  return createToolMetadata(tool)
}

export default async function WorkToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getTool('tools', slug)
  if (!tool) notFound()
  return <ToolDetail tool={tool}><WorkTool slug={tool.slug} /></ToolDetail>
}
