import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://workingnow.live'
  const locales = ['en', 'zh', 'ja']
  
  // 为每种语言的主页生成站点地图条目
  const entries = locales.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0, // 权重最高
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...entries,
  ]
}