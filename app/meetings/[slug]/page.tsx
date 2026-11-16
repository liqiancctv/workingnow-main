import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/product/tool-detail'
import { getTool, getTools } from '@/data/tools'
import { MeetingTool } from '@/features/meetings/meeting-tools'
import { createToolMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getTools('meetings').map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getTool('meetings', slug)
  if (!tool) return { title: 'Meeting tool not found' }
  return createToolMetadata(tool)
}

export default async function MeetingToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getTool('meetings', slug)
  if (!tool) notFound()
  return <ToolDetail tool={tool}><MeetingTool slug={tool.slug} /></ToolDetail>
}
