import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/', // 允许抓取主站和多语言主页
      disallow: [
        '/*/vscode',     // ⚠️ 禁止抓取任何语言下的 VS Code 界面
        '/outlook/',     // ⚠️ 禁止抓取 1:1 Outlook 静态老页面
        '/gossip.json',  // ⚠️ 禁止抓取你的爬虫八卦原始数据
      ],
    },
    sitemap: 'https://workingnow.live/sitemap.xml',
  }
}