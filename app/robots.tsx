import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/gossip.json'],
    },
    sitemap: 'https://workingnow.live/sitemap.xml',
  }
}
