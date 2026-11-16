import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/product/tool-detail'
import { getTool, getTools } from '@/data/tools'
import { DiscoverContent } from '@/features/discover/discover-content'
import { isDiscoverSlug } from '@/features/discover/content'
import { createToolMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getTools('discover').filter(({ slug }) => isDiscoverSlug(slug)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getTool('discover', slug)
  return tool && isDiscoverSlug(slug) ? createToolMetadata(tool) : { title: 'Discover page not found' }
}

export default async function DiscoverPage({ params }: Props) {
  const { slug } = await params
  const tool = getTool('discover', slug)
  if (!tool || !isDiscoverSlug(slug)) notFound()
  return <ToolDetail tool={tool}><DiscoverContent slug={slug} /></ToolDetail>
}
