import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/product/tool-detail'
import { getTool, type ToolCategory } from '@/data/tools'
import { BreakTool } from '@/features/break/break-tool'
import { isBreakSlug } from '@/features/break/logic'
import { DiscoverContent } from '@/features/discover/discover-content'
import { isDiscoverSlug } from '@/features/discover/content'
import { MeetingTool } from '@/features/meetings/meeting-tools'
import { WorkTool } from '@/features/work-tools/work-tools'
import { createToolMetadata } from '@/lib/seo/metadata'
import { isProductLocale } from '@/app/i18n/settings'
import { getProductText } from '@/lib/product-i18n'
import type { ProductLocale } from '@/app/i18n/settings'

type Props = { params: Promise<{ lng: string; section: string; slug: string }> }
const categories: ToolCategory[] = ['meetings', 'tools', 'break', 'discover']

function getLocale(value: string): ProductLocale {
  if (!isProductLocale(value)) notFound()
  return value
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng, section, slug } = await params
  const locale = getLocale(lng)
  if (!categories.includes(section as ToolCategory)) return { title: getProductText(locale, '404.title') }
  const tool = getTool(section as ToolCategory, slug)
  if (!tool) return { title: getProductText(locale, '404.title') }
  return createToolMetadata(tool, locale)
}

export default async function LocalizedToolPage({ params }: Props) {
  const { lng, section, slug } = await params
  const locale = getLocale(lng)
  if (!categories.includes(section as ToolCategory)) notFound()
  const category = section as ToolCategory
  const tool = getTool(category, slug)
  if (!tool) notFound()
  if (category === 'break' && !isBreakSlug(slug)) notFound()
  if (category === 'discover' && !isDiscoverSlug(slug)) notFound()

  const feature = category === 'meetings'
    ? <MeetingTool slug={slug} />
    : category === 'tools'
      ? <WorkTool slug={slug} />
      : category === 'break'
        ? <BreakTool slug={slug as Parameters<typeof BreakTool>[0]['slug']} />
        : <DiscoverContent slug={slug as Parameters<typeof DiscoverContent>[0]['slug']} />

  return <ToolDetail tool={tool} locale={locale}>{feature}</ToolDetail>
}
