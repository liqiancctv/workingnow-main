import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

// 简单的动态读取字典函数（实际开发可以用 fs 或 import）
async function getTranslation(lng: string) {
  try {
    return await import(`./i18n/locales/${lng}.json`).then((m) => m.default)
  } catch {
    return await import(`./i18n/locales/en.json`).then((m) => m.default)
  }
}

type Props = {
  params: Promise<{ lng: string }>
}

// 🌐 这一段代码是给 Google 爬虫量身定制的“路标”
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params
  
  // 根据不同语言动态定制搜索结果里显示的标题和简介
  const titles: Record<string, string> = {
    en: "WorkingNow - Ultimate Enterprise Cloud & Developer Dashboard",
    zh: "WorkingNow - 现代化企业云端数据监视中台与打工人导航",
    ja: "WorkingNow - 開発者向けエンタープライズクラウドダッシュボード"
  }
  
  const descriptions: Record<string, string> = {
    en: "Monitor active server nodes, cloud workloads, and optimize engineering workflows in real-time.",
    zh: "实时监控服务器节点、云端负载，提供企业级数据面板及全栈独立开发者工具导航。",
    ja: "アクティブなサーバーノード、クラウドワークロードをリアルタイムで監視します。"
  }

  return {
    title: titles[lng] || titles.en,
    description: descriptions[lng] || descriptions.en,
    
    // 🧠 核心：告诉 Google 不同的语言版本去哪里抓取（防重复内容惩罚）
    alternates: {
      canonical: `https://workingnow.live/${lng}`,
      languages: {
        'en': 'https://workingnow.live/en',
        'zh': 'https://workingnow.live/zh',
        'ja': 'https://workingnow.live/ja',
        'x-default': 'https://workingnow.live/en', // 默认缺省语言
      },
    },
  }
}

export default async function DashboardPage({ params }: { params: { lng: string } }) {
  const t = await getTranslation(params.lng)
  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <span className="text-xl font-bold tracking-wider text-blue-500">🤫 WorkingNow</span>
          </div>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">📁 Dashboard</Button>
            <a href={`vscode`} target="_blank" className="w-full">
              <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">💻 R&D (VS Code)</Button>
            </a>
            <a href="/MSOutlookit/index.html" className="w-full" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="w-full justify-start text-white bg-slate-800">📈 Admin (Outlook)</Button>
            </a>
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">📊 Marketing (Notion)</Button>
          </nav>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          Status: <span className="text-green-500">{t.active_nodes}  (1,421)</span>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Enterprise Cloud Monitor</h1>
          <Button variant="outline" className="border-slate-800 text-slate-400 hover:bg-slate-900">System Logs</Button>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Server Load</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">42.8 %</div>
              <p className="text-xs text-slate-500">Optimal efficiency</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active API Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">12,482 / min</div>
              <p className="text-xs text-slate-500">+12% from last hour</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-blue-900/50 text-white relative overflow-hidden border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">🔒 Hardware Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 mb-2">Want the physical "Panic Button" macro-pad?</p>
              <input type="email" placeholder="Enter email for 40% OFF" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs mb-2 focus:outline-none focus:border-blue-500" />
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs text-white">Secure Early Bird</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}