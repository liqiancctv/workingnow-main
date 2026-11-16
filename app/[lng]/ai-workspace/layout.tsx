import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { createLegacyMetadata } from '@/lib/seo/legacy-metadata'
import { getTranslations } from '@/lib/translations'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params
  const t = getTranslations(lng)
  return createLegacyMetadata(lng, 'ai-workspace', t.home_ai_title, t.home_ai_description)
}

export default function AIWorkspaceLayout({ children }: { children: ReactNode }) {
  return children
}
