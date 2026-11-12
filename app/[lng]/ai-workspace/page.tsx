'use client'

import {
  Activity,
  ArrowUp,
  Check,
  ChevronDown,
  CircleHelp,
  Command,
  Copy,
  Menu,
  MessageSquare,
  PanelLeftClose,
  Plus,
  Search,
  Settings2,
  ShieldAlert,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react'
import { use, useEffect, useRef, useState, type ReactNode } from 'react'
import { StealthNav } from '@/components/stealth-nav'
import { useDemoStream } from '@/components/demo-mode'
import { getTranslations, type Locale } from '@/lib/translations'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  format?: 'report'
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
}

const copy = {
  en: {
    newChat: 'New chat', search: 'Search', workspace: 'Workspace', today: 'Today', emptyHistory: 'Your conversations will appear here.', openMenu: 'Open sidebar', closeMenu: 'Close sidebar', sendMessage: 'Send message',
    settings: 'Settings', help: 'Help center', profile: 'Personal workspace', model: 'WorkingNow AI', modelHint: 'Standard',
    welcome: 'What can I help with?', welcomeHint: 'Ask a question or describe what you are working on.',
    placeholder: 'Message WorkingNow AI', disclaimer: 'WorkingNow AI can make mistakes. Check important information.',
    suggestions: ['Explain React Server Components', 'Review a caching strategy', 'Draft a migration plan'],
    shield: 'Emergency shield', settingsTitle: 'Preferences', appearance: 'Appearance', light: 'Light', language: 'Language',
    generating: 'Working through the details', copy: 'Copy', copied: 'Copied', assistant: 'WorkingNow AI',
    reportLabel: 'ARCHITECTURE SIGNAL', reportTitle: 'Background intelligence digest', source: 'Local content source',
    emptyCommand: 'No local stories were found. Add items to public/gossip.json and try again.',
    novelBody: 'A quiet anomaly appeared in the event stream at 09:42. The edge cache had replayed a stale shard, while the origin remained healthy. The on-call engineer traced the drift to a retry policy inherited from the previous release.',
    restore: 'Return to workspace', shieldTitle: 'PRODUCTION INCIDENT', shieldSub: 'Kubernetes control plane · us-east-1', cluster: 'CLUSTER STATUS',
    degraded: 'DEGRADED', pipeline: 'DEPLOYMENT PIPELINE', running: 'ROLLING BACK', log: 'LIVE EVENT STREAM',
    logs: ['09:42:18.204  WARN  ingress/controller  upstream latency above SLO', '09:42:18.517  ERROR scheduler  pod/api-7f9c pending: insufficient memory', '09:42:19.008  INFO  deployment/api  rollback requested by health check', '09:42:19.224  INFO  replica-set  scaling stable revision to 6 pods', '09:42:20.014  WARN  cache/edge  stale shard invalidation in progress', '09:42:20.606  INFO  readiness probe  5/6 replicas healthy', '09:42:21.332  INFO  control-plane  reconciliation loop active'],
  },
  zh: {
    newChat: '新建对话', search: '搜索', workspace: '工作区', today: '今天', emptyHistory: '对话会显示在这里。', openMenu: '打开侧栏', closeMenu: '关闭侧栏', sendMessage: '发送消息',
    settings: '设置', help: '帮助中心', profile: '个人工作区', model: 'WorkingNow AI', modelHint: '标准',
    welcome: '有什么可以帮你？', welcomeHint: '提问，或描述你正在处理的事情。',
    placeholder: '发送消息给 WorkingNow AI', disclaimer: 'WorkingNow AI 可能会出错。请核实重要信息。',
    suggestions: ['解释 React Server Components', '评审缓存策略', '起草迁移计划'],
    shield: '紧急保护', settingsTitle: '偏好设置', appearance: '外观', light: '浅色', language: '语言',
    generating: '正在整理思路', copy: '复制', copied: '已复制', assistant: 'WorkingNow AI',
    reportLabel: '架构信号', reportTitle: '后台情报摘要', source: '本地内容源',
    emptyCommand: '没有找到本地内容。请在 public/gossip.json 中添加内容后重试。',
    novelBody: '09:42，事件流中出现了一处安静的异常。边缘缓存重放了一个过期分片，而源站仍然健康。值班工程师追踪后发现，漂移来自上一版本遗留的重试策略。',
    restore: '返回工作区', shieldTitle: '生产环境事故', shieldSub: 'Kubernetes 控制平面 · us-east-1', cluster: '集群状态',
    degraded: '降级运行', pipeline: '部署流水线', running: '正在回滚', log: '实时事件流',
    logs: ['09:42:18.204  WARN  ingress/controller  上游延迟超过 SLO', '09:42:18.517  ERROR scheduler  pod/api-7f9c 等待中：内存不足', '09:42:19.008  INFO  deployment/api  健康检查已请求回滚', '09:42:19.224  INFO  replica-set  稳定版本扩容至 6 个 Pod', '09:42:20.014  WARN  cache/edge  正在清理过期分片', '09:42:20.606  INFO  readiness probe  6 个副本中 5 个健康', '09:42:21.332  INFO  control-plane  协调循环运行中'],
  },
  ja: {
    newChat: '新しいチャット', search: '検索', workspace: 'ワークスペース', today: '今日', emptyHistory: '会話がここに表示されます。', openMenu: 'サイドバーを開く', closeMenu: 'サイドバーを閉じる', sendMessage: 'メッセージを送信',
    settings: '設定', help: 'ヘルプセンター', profile: '個人ワークスペース', model: 'WorkingNow AI', modelHint: '標準',
    welcome: 'どのようなお手伝いができますか？', welcomeHint: '質問するか、作業内容を入力してください。',
    placeholder: 'WorkingNow AI にメッセージを送信', disclaimer: 'WorkingNow AI は誤ることがあります。重要な情報は確認してください。',
    suggestions: ['React Server Components を解説', 'キャッシュ戦略をレビュー', '移行計画を作成'],
    shield: '緊急シールド', settingsTitle: '設定', appearance: '外観', light: 'ライト', language: '言語',
    generating: '回答を整理しています', copy: 'コピー', copied: 'コピーしました', assistant: 'WorkingNow AI',
    reportLabel: 'アーキテクチャシグナル', reportTitle: 'バックグラウンド情報ダイジェスト', source: 'ローカルコンテンツ',
    emptyCommand: 'ローカル記事がありません。public/gossip.json に追加して再試行してください。',
    novelBody: '09:42、イベントストリームに静かな異常が現れました。エッジキャッシュが古いシャードを再生しましたが、オリジンは正常でした。オンコール担当者は、前回のリリースから引き継がれたリトライポリシーに原因を特定しました。',
    restore: 'ワークスペースに戻る', shieldTitle: '本番環境インシデント', shieldSub: 'Kubernetes control plane · us-east-1', cluster: 'クラスター状態',
    degraded: '縮退運転', pipeline: 'デプロイパイプライン', running: 'ロールバック中', log: 'ライブイベントストリーム',
    logs: ['09:42:18.204  WARN  ingress/controller  upstream latency above SLO', '09:42:18.517  ERROR scheduler  pod/api-7f9c pending: insufficient memory', '09:42:19.008  INFO  deployment/api  rollback requested by health check', '09:42:19.224  INFO  replica-set  scaling stable revision to 6 pods', '09:42:20.014  WARN  cache/edge  stale shard invalidation in progress', '09:42:20.606  INFO  readiness probe  5/6 replicas healthy', '09:42:21.332  INFO  control-plane  reconciliation loop active'],
  },
  ms: {
    newChat: 'Sembang baharu', search: 'Cari', workspace: 'Ruang kerja', today: 'Hari ini', emptyHistory: 'Perbualan anda akan dipaparkan di sini.', openMenu: 'Buka bar sisi', closeMenu: 'Tutup bar sisi', sendMessage: 'Hantar mesej',
    settings: 'Tetapan', help: 'Pusat bantuan', profile: 'Ruang kerja peribadi', model: 'WorkingNow AI', modelHint: 'Standard',
    welcome: 'Apa yang boleh saya bantu?', welcomeHint: 'Tanya soalan atau terangkan perkara yang sedang anda kerjakan.',
    placeholder: 'Mesej kepada WorkingNow AI', disclaimer: 'WorkingNow AI mungkin membuat kesilapan. Semak maklumat penting.',
    suggestions: ['Terangkan React Server Components', 'Semak strategi cache', 'Rangka pelan migrasi'],
    shield: 'Perlindungan kecemasan', settingsTitle: 'Keutamaan', appearance: 'Penampilan', light: 'Cerah', language: 'Bahasa',
    generating: 'Sedang menyusun butiran', copy: 'Salin', copied: 'Disalin', assistant: 'WorkingNow AI',
    reportLabel: 'ISYARAT SENI BINA', reportTitle: 'Ringkasan maklumat latar', source: 'Sumber kandungan setempat',
    emptyCommand: 'Tiada cerita setempat ditemui. Tambahkan item pada public/gossip.json dan cuba lagi.',
    novelBody: 'Satu anomali kecil muncul dalam strim peristiwa pada 09:42. Cache edge memainkan semula shard lapuk sedangkan origin kekal sihat. Jurutera bertugas mengesan punca kepada dasar percubaan semula yang diwarisi daripada keluaran sebelumnya.',
    restore: 'Kembali ke ruang kerja', shieldTitle: 'INSIDEN PRODUKSI', shieldSub: 'Kubernetes control plane · us-east-1', cluster: 'STATUS KLUSTER',
    degraded: 'TERGANGGU', pipeline: 'SALURAN PAIPAN PENERBITAN', running: 'SEDANG UNDUR BALIK', log: 'STRIM PERISTIWA LANGSUNG',
    logs: ['09:42:18.204  WARN  ingress/controller  latensi huluan melebihi SLO', '09:42:18.517  ERROR scheduler  pod/api-7f9c menunggu: memori tidak mencukupi', '09:42:19.008  INFO  deployment/api  pemeriksaan kesihatan meminta undur balik', '09:42:19.224  INFO  replica-set  skala revisi stabil kepada 6 pod', '09:42:20.014  WARN  cache/edge  pembatalan shard lapuk sedang berjalan', '09:42:20.606  INFO  readiness probe  5/6 replika sihat', '09:42:21.332  INFO  control-plane  gelung penyelarasan aktif'],
  },
  vi: {
    newChat: 'Cuộc trò chuyện mới', search: 'Tìm kiếm', workspace: 'Không gian làm việc', today: 'Hôm nay', emptyHistory: 'Các cuộc trò chuyện sẽ xuất hiện ở đây.', openMenu: 'Mở thanh bên', closeMenu: 'Đóng thanh bên', sendMessage: 'Gửi tin nhắn',
    settings: 'Cài đặt', help: 'Trung tâm trợ giúp', profile: 'Không gian cá nhân', model: 'WorkingNow AI', modelHint: 'Tiêu chuẩn',
    welcome: 'Tôi có thể giúp gì cho bạn?', welcomeHint: 'Đặt câu hỏi hoặc mô tả công việc bạn đang thực hiện.',
    placeholder: 'Nhắn tin cho WorkingNow AI', disclaimer: 'WorkingNow AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.',
    suggestions: ['Giải thích React Server Components', 'Đánh giá chiến lược bộ nhớ đệm', 'Lập kế hoạch chuyển đổi'],
    shield: 'Lá chắn khẩn cấp', settingsTitle: 'Tùy chọn', appearance: 'Giao diện', light: 'Sáng', language: 'Ngôn ngữ',
    generating: 'Đang xử lý chi tiết', copy: 'Sao chép', copied: 'Đã sao chép', assistant: 'WorkingNow AI',
    reportLabel: 'TÍN HIỆU KIẾN TRÚC', reportTitle: 'Tóm tắt thông tin nền', source: 'Nguồn nội dung cục bộ',
    emptyCommand: 'Không tìm thấy tin cục bộ. Hãy thêm mục vào public/gossip.json rồi thử lại.',
    novelBody: 'Một bất thường nhỏ xuất hiện trong luồng sự kiện lúc 09:42. Bộ nhớ đệm biên phát lại một phân đoạn cũ trong khi máy chủ gốc vẫn ổn định. Kỹ sư trực ca lần ra nguyên nhân là chính sách thử lại được kế thừa từ bản phát hành trước.',
    restore: 'Quay lại không gian làm việc', shieldTitle: 'SỰ CỐ MÔI TRƯỜNG THẬT', shieldSub: 'Kubernetes control plane · us-east-1', cluster: 'TRẠNG THÁI CỤM',
    degraded: 'SUY GIẢM', pipeline: 'ĐƯỜNG ỐNG TRIỂN KHAI', running: 'ĐANG QUAY LUI', log: 'LUỒNG SỰ KIỆN TRỰC TIẾP',
    logs: ['09:42:18.204  WARN  ingress/controller  độ trễ thượng nguồn vượt SLO', '09:42:18.517  ERROR scheduler  pod/api-7f9c đang chờ: không đủ bộ nhớ', '09:42:19.008  INFO  deployment/api  kiểm tra sức khỏe yêu cầu quay lui', '09:42:19.224  INFO  replica-set  tăng phiên bản ổn định lên 6 pod', '09:42:20.014  WARN  cache/edge  đang vô hiệu hóa phân đoạn cũ', '09:42:20.606  INFO  readiness probe  5/6 bản sao khỏe mạnh', '09:42:21.332  INFO  control-plane  vòng điều phối đang hoạt động'],
  },
} as const

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function StreamedText({ text, paused = false }: { text: string; paused?: boolean }) {
  const [visibleLength, setVisibleLength] = useState(0)
  const positionRef = useRef(0)

  useEffect(() => {
    if (paused || positionRef.current >= text.length) return
    const timer = window.setInterval(() => {
      positionRef.current = Math.min(positionRef.current + 3, text.length)
      setVisibleLength(positionRef.current)
      if (positionRef.current >= text.length) window.clearInterval(timer)
    }, 12)

    return () => window.clearInterval(timer)
  }, [paused, text.length])

  return <><MarkdownResponse text={text.slice(0, visibleLength)} /><span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-neutral-500 align-middle" aria-hidden="true" /></>
}

function AssistantMark({ small = false }: { small?: boolean }) {
  return <span className={`grid shrink-0 place-items-center rounded-full bg-neutral-900 text-white ${small ? 'size-7' : 'size-8'}`}><Sparkles size={small ? 14 : 16} strokeWidth={1.8} /></span>
}

function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('`')) return <code key={index} className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] text-rose-700">{part.slice(1, -1)}</code>
    if (part.startsWith('**')) return <strong key={index} className="font-semibold text-neutral-800">{part.slice(2, -2)}</strong>
    return part
  })
}

function highlightCode(code: string): ReactNode[] {
  const keywords = new Set(['async', 'await', 'const', 'default', 'export', 'from', 'function', 'import', 'return'])
  return code.split(/(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[A-Za-z_$][\w$]*\b|\b\d+\b)/g).map((token, index) => {
    let className = ''
    if (token.startsWith('//')) className = 'text-neutral-400'
    else if (/^["'`]/.test(token)) className = 'text-emerald-700'
    else if (keywords.has(token)) className = 'font-semibold text-violet-700'
    else if (/^\d+$/.test(token)) className = 'text-amber-700'
    else if (/^[A-Z]/.test(token)) className = 'text-sky-700'
    return <span key={index} className={className}>{token}</span>
  })
}

function MarkdownResponse({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  const codeFence = /```([\w-]*)\n([\s\S]*?)```/g
  let cursor = 0
  let match: RegExpExecArray | null

  const addText = (content: string, key: number) => {
    if (!content) return
    blocks.push(<div key={`text-${key}`} className="space-y-2">{content.split('\n').map((line, lineIndex) => {
      const item = line.match(/^(\d+)\.\s+(.+)$/)
      if (item) return <div key={lineIndex} className="flex gap-2"><span className="text-neutral-400">{item[1]}.</span><span>{renderInlineMarkdown(item[2])}</span></div>
      return line ? <p key={lineIndex}>{renderInlineMarkdown(line)}</p> : <div key={lineIndex} className="h-2" />
    })}</div>)
  }

  while ((match = codeFence.exec(text)) !== null) {
    addText(text.slice(cursor, match.index), cursor)
    blocks.push(
      <div key={`code-${match.index}`} className="my-3 overflow-hidden rounded-lg border border-neutral-200 bg-[#f7f7f8]">
        <div className="border-b border-neutral-200 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-neutral-500">{match[1] || 'code'}</div>
        <pre className="overflow-x-auto p-4 text-[12px] leading-6"><code>{highlightCode(match[2])}</code></pre>
      </div>,
    )
    cursor = match.index + match[0].length
  }
  addText(text.slice(cursor), cursor)

  return <div className="text-[15px] leading-7 text-neutral-700">{blocks}</div>
}

export default function AIWorkspacePage({ params }: { params: Promise<{ lng: string }> }) {
  const routeParams = use(params)
  const lng = routeParams.lng in copy ? routeParams.lng as keyof typeof copy : 'en'
  const t = copy[lng]
  const demoText = getTranslations(lng as Locale)
  const demoStream = useDemoStream(demoText.demo_ai_samples, 5600)
  const [threads, setThreads] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState('')
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isShielded, setIsShielded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [copiedId, setCopiedId] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const activeThread = threads.find((thread) => thread.id === activeId)
  const messages = activeThread?.messages ?? []

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsShielded((current) => !current)
        setSettingsOpen(false)
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, demoStream.events.length, isGenerating])

  function startNewChat() {
    const id = makeId()
    setThreads((current) => [{ id, title: t.newChat, messages: [] }, ...current])
    setActiveId(id)
    setInput('')
    setSidebarOpen(false)
    inputRef.current?.focus()
  }

  function createAssistantReply(prompt: string): Promise<Message> {
    const command = prompt.trim().match(/^\/(news|gossip|novel)\b/i)?.[1]?.toLowerCase()

    if (command === 'news' || command === 'gossip') {
      return fetch('/gossip.json')
        .then(async (response) => {
          if (!response.ok) throw new Error('Unable to load local content')
          const stories = await response.json() as string[]
          const selected = stories[Math.floor(Math.random() * stories.length)]
          return {
            id: makeId(),
            role: 'assistant' as const,
            format: 'report' as const,
            content: selected ? selected.replace(/^🔥\s*\[BREAKING\]\s*/i, '') : t.emptyCommand,
          }
        })
        .catch(() => ({ id: makeId(), role: 'assistant' as const, format: 'report' as const, content: t.emptyCommand }))
    }

    if (command === 'novel') {
      return Promise.resolve({ id: makeId(), role: 'assistant', format: 'report', content: t.novelBody })
    }

    const lowerPrompt = prompt.toLowerCase()
    const answer = /react|server component|rsc/.test(lowerPrompt)
      ? 'React Server Components render on the server and send a serialized component tree to the browser. They can read server-side data without shipping that code to the client. Add a client boundary only for interactive pieces that need state, effects, or browser APIs.\n\n```tsx\nimport { db } from \'@/lib/db\'\n\nexport default async function ProjectPage() {\n  const project = await db.project.findFirst()\n  return <h1>{project?.name}</h1>\n}\n```'
      : /cache|cach/.test(lowerPrompt)
        ? 'A useful caching review starts with three questions: what is the source of truth, how fresh must each response be, and what invalidates it? Keep personalized data out of shared caches, define explicit revalidation boundaries, and verify behavior under concurrent requests.'
        : /migration|migrat|plan/.test(lowerPrompt)
          ? 'Start with a compatibility inventory, then migrate one low-risk path end to end. Add contract tests before changing the implementation, ship behind a feature flag, and keep a rollback path until production metrics confirm parity.'
          : `Here is a practical way to approach “${prompt}”:\n\n1. Identify the outcome you need and the constraints that matter.\n2. Break the work into a small, testable first step.\n3. Validate the result against the real usage path before expanding it.\n\nShare a little more context and I can make the recommendation more specific.`

    return new Promise((resolve) => window.setTimeout(() => resolve({ id: makeId(), role: 'assistant', content: answer }), 520))
  }

  async function sendMessage(rawInput = input) {
    const prompt = rawInput.trim()
    if (!prompt || isGenerating) return
    const threadId = activeId || makeId()
    const userMessage: Message = { id: makeId(), role: 'user', content: prompt }

    setThreads((current) => {
      const existing = current.find((thread) => thread.id === threadId)
      if (existing) {
        return current.map((thread) => thread.id === threadId
          ? { ...thread, title: thread.messages.length ? thread.title : prompt.slice(0, 34), messages: [...thread.messages, userMessage] }
          : thread)
      }
      return [{ id: threadId, title: prompt.slice(0, 34), messages: [userMessage] }, ...current]
    })
    setActiveId(threadId)
    setInput('')
    setIsGenerating(true)
    if (inputRef.current) inputRef.current.style.height = 'auto'

    const reply = await createAssistantReply(prompt)
    setThreads((current) => current.map((thread) => thread.id === threadId
      ? { ...thread, messages: [...thread.messages, reply] }
      : thread))
    setIsGenerating(false)
  }

  async function copyMessage(message: Message) {
    await navigator.clipboard.writeText(message.content)
    setCopiedId(message.id)
    window.setTimeout(() => setCopiedId(''), 1400)
  }

  if (isShielded) {
    return (
      <main className="fixed inset-0 z-50 overflow-y-auto bg-[#090d0d] font-mono text-emerald-300 selection:bg-emerald-900">
        <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-5 sm:px-8">
          <header className="flex items-center justify-between border-b border-emerald-950 pb-4">
            <div className="flex items-center gap-3"><Terminal size={18} /><span className="text-xs tracking-[0.18em] text-emerald-100">OPS CONSOLE <span className="text-emerald-800">/</span> PLATFORM ENGINEERING</span></div>
            <button type="button" onClick={() => setIsShielded(false)} className="flex items-center gap-2 rounded border border-emerald-900 px-3 py-2 text-xs text-emerald-300 transition hover:border-emerald-500 hover:bg-emerald-950/60"><X size={14} />{t.restore}</button>
          </header>

          <section className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 flex items-center gap-2 text-[10px] tracking-[0.2em] text-emerald-700"><Activity size={13} /> INCIDENT RESPONSE <span className="text-emerald-900">{'//'}</span> INC-2026-1108</p><h1 className="text-2xl font-semibold tracking-[0.08em] text-emerald-100 sm:text-3xl">{t.shieldTitle.toUpperCase()}</h1><p className="mt-2 text-xs text-emerald-700">{t.shieldSub}</p></div>
            <div className="flex items-center gap-2 border border-red-950 bg-red-950/20 px-3 py-2 text-[10px] tracking-[0.16em] text-red-400"><span className="size-2 animate-pulse rounded-full bg-red-500" />SEV-2 · INVESTIGATING</div>
          </section>

          <section className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="border border-emerald-950 bg-[#0c1311] p-4"><p className="text-[10px] tracking-[0.16em] text-emerald-800">{t.cluster}</p><p className="mt-3 text-lg font-semibold text-amber-400">{t.degraded}</p><p className="mt-1 text-[11px] text-emerald-800">prod-cluster-a · 5/6 nodes ready</p></div>
            <div className="border border-emerald-950 bg-[#0c1311] p-4"><p className="text-[10px] tracking-[0.16em] text-emerald-800">{t.pipeline}</p><p className="mt-3 text-lg font-semibold text-emerald-300">{t.running}</p><div className="mt-3 h-1 overflow-hidden bg-emerald-950"><div className="h-full w-[68%] animate-pulse bg-emerald-500" /></div></div>
            <div className="border border-emerald-950 bg-[#0c1311] p-4"><p className="text-[10px] tracking-[0.16em] text-emerald-800">ERROR BUDGET · 30D</p><p className="mt-3 text-lg font-semibold text-emerald-100">99.92<span className="text-sm text-emerald-700">% SLO</span></p><p className="mt-1 text-[11px] text-emerald-800">Burn rate 2.4x · elevated</p></div>
          </section>

          <section className="mt-6 flex-1 border border-emerald-950 bg-[#0b100f]">
            <div className="flex items-center justify-between border-b border-emerald-950 px-4 py-3"><p className="text-[10px] tracking-[0.18em] text-emerald-700">{t.log}</p><span className="text-[10px] text-emerald-900">STREAM CONNECTED</span></div>
            <div className="space-y-3 p-4 text-[11px] leading-relaxed sm:text-xs">{t.logs.map((line) => <p key={line} className={line.includes('ERROR') ? 'text-red-400' : line.includes('WARN') ? 'text-amber-400' : 'text-emerald-700'}><span className="mr-3 text-emerald-950">›</span>{line}</p>)}<p className="animate-pulse text-emerald-400">› _</p></div>
          </section>
          <footer className="pt-4 text-[10px] tracking-[0.12em] text-emerald-950">PLATFORM OBSERVABILITY · AUTO-REFRESH 2S · ESC TO TOGGLE WORKSPACE</footer>
        </div>
      </main>
    )
  }

  return (
    <main className="flex h-dvh min-h-[520px] flex-col overflow-hidden bg-white text-neutral-800">
      <StealthNav lng={lng} active="ai" />
      <div className="flex min-h-0 flex-1">
      {sidebarOpen && <button aria-label={t.closeMenu} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/25 md:hidden" />}
      <aside className={`fixed bottom-0 left-0 top-14 z-30 flex w-[260px] flex-col border-r border-neutral-200 bg-[#f7f7f8] transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-3 pb-3 pt-3">
          <button type="button" onClick={startNewChat} className="flex min-w-0 items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium hover:bg-neutral-200/70"><span className="grid size-7 place-items-center rounded-md bg-neutral-900 text-white"><Sparkles size={15} /></span><span className="truncate">{t.workspace}</span></button>
          <button type="button" aria-label={t.closeMenu} title={t.closeMenu} onClick={() => setSidebarOpen(false)} className="hidden size-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-200 md:grid"><PanelLeftClose size={17} /></button>
          <button type="button" aria-label={t.closeMenu} onClick={() => setSidebarOpen(false)} className="grid size-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-200 md:hidden"><X size={17} /></button>
        </div>

        <div className="space-y-1 px-3 pb-4">
          <button type="button" onClick={startNewChat} className="flex h-9 w-full items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm hover:bg-neutral-50"><Plus size={16} /><span>{t.newChat}</span><span className="ml-auto flex items-center gap-1 text-[10px] text-neutral-400"><Command size={11} />K</span></button>
          <button type="button" onClick={() => inputRef.current?.focus()} className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-neutral-600 hover:bg-neutral-200/70"><Search size={16} /><span>{t.search}</span></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3">
          <p className="px-2 pb-2 pt-2 text-[11px] font-medium text-neutral-500">{t.today}</p>
          {threads.length === 0 && <p className="px-2 py-2 text-xs leading-5 text-neutral-400">{t.emptyHistory}</p>}
          {threads.map((thread) => <button key={thread.id} type="button" onClick={() => { setActiveId(thread.id); setSidebarOpen(false) }} className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] ${thread.id === activeId ? 'bg-neutral-200/80 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-200/60'}`}><MessageSquare size={14} className="shrink-0 text-neutral-400" /><span className="truncate">{thread.title}</span></button>)}
        </div>

        <div className="relative border-t border-neutral-200 p-3">
          {settingsOpen && <div className="absolute bottom-[calc(100%-4px)] left-3 right-3 z-10 rounded-lg border border-neutral-200 bg-white p-3 shadow-lg"><p className="mb-3 text-xs font-semibold">{t.settingsTitle}</p><div className="flex items-center justify-between py-1 text-xs text-neutral-500"><span>{t.appearance}</span><span className="rounded border border-neutral-200 px-2 py-1 text-neutral-700">{t.light}</span></div><div className="flex items-center justify-between py-1 text-xs text-neutral-500"><span>{t.language}</span><span className="rounded border border-neutral-200 px-2 py-1 uppercase text-neutral-700">{lng}</span></div></div>}
          <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-neutral-600 hover:bg-neutral-200/70"><Settings2 size={15} />{t.settings}<ChevronDown size={13} className="ml-auto" /></button>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-neutral-600 hover:bg-neutral-200/70"><CircleHelp size={15} />{t.help}</button>
          <div className="mt-2 flex items-center gap-2 rounded-md px-2 py-2"><span className="grid size-7 place-items-center rounded-full bg-[#d8e6df] text-[10px] font-semibold text-[#395448]">WN</span><span className="min-w-0 flex-1 truncate text-xs font-medium">{t.profile}</span><ChevronDown size={14} className="text-neutral-400" /></div>
        </div>
      </aside>

      <section className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between px-3 sm:px-5">
          <div className="flex items-center gap-2">
            <button type="button" aria-label={t.openMenu} title={t.openMenu} onClick={() => setSidebarOpen(true)} className="grid size-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 md:hidden"><Menu size={19} /></button>
            <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-neutral-100"><span>{t.model}</span><span className="text-neutral-400">{t.modelHint}</span><ChevronDown size={14} className="text-neutral-400" /></button>
            <span className="rounded border border-sky-200 bg-sky-50 px-1.5 py-1 text-[9px] font-medium text-sky-800">{demoText.demo_badge}</span>
          </div>
          <button type="button" aria-label={t.shield} title={`${t.shield} · Esc`} onDoubleClick={() => setIsShielded(true)} onClick={() => setIsShielded(true)} className="grid size-9 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"><ShieldAlert size={18} /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {messages.length === 0 && demoStream.events.length === 0 ? (
            <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-5 pb-24 text-center">
              <AssistantMark />
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-800 sm:text-[28px]">{t.welcome}</h1>
              <p className="mt-2 text-sm text-neutral-500">{t.welcomeHint}</p>
              {demoStream.enabled && <p className="mt-4 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-medium text-sky-800">{demoText.demo_badge} · {demoText.demo_conversation}</p>}
              <div className="mt-8 flex max-w-2xl flex-wrap justify-center gap-2">{t.suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void sendMessage(suggestion)} className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 sm:text-sm">{suggestion}</button>)}</div>
              <p className="mt-6 text-[11px] text-neutral-400">/news · /gossip · /novel</p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-5 pb-10 pt-5 sm:px-8">
              {messages.map((message) => message.role === 'user' ? (
                <div key={message.id} className="mb-7 flex justify-end"><div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-[#f4f4f4] px-4 py-3 text-[15px] leading-7 text-neutral-800">{message.content}</div></div>
              ) : (
                <div key={message.id} className="mb-8 flex gap-3.5">
                  <AssistantMark small />
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-2 text-[13px] font-semibold text-neutral-800">{t.assistant}</div>
                    {message.format === 'report' ? <div className="overflow-hidden rounded-lg border border-neutral-200 bg-[#fafafa]">
                      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5"><span className="text-[10px] font-semibold tracking-[0.14em] text-neutral-500">{t.reportLabel}</span><span className="text-[10px] text-neutral-400">{t.source}</span></div>
                      <div className="px-4 py-4"><p className="mb-2 text-xs font-medium text-neutral-500">{t.reportTitle}</p><p className="text-sm leading-6 text-neutral-800">{message.content}</p><div className="mt-4 border-t border-dashed border-neutral-200 pt-3 font-mono text-[10px] text-neutral-400">event: content.indexed · status: 200 · source: local-feed</div></div>
                    </div> : <StreamedText text={message.content} />}
                    <div className="mt-2 flex items-center gap-1"><button type="button" onClick={() => void copyMessage(message)} aria-label={copiedId === message.id ? t.copied : t.copy} title={copiedId === message.id ? t.copied : t.copy} className="grid size-7 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">{copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}</button></div>
                  </div>
                </div>
              ))}
              {demoStream.events.length > 0 && <section aria-label={demoText.demo_conversation} className="mb-8 border-t border-dashed border-sky-200 pt-5">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-800"><span className="size-1.5 animate-pulse rounded-full bg-sky-500" />{demoText.demo_badge} · {demoText.demo_conversation}</p>
                <div className="space-y-5">{demoStream.events.map((event) => <div key={event.id} className="flex gap-3.5"><AssistantMark small /><div className="min-w-0 flex-1"><p className="mb-1 text-[12px] font-semibold text-neutral-700">{t.assistant} <span className="ml-1 font-normal text-sky-700">· {demoText.demo_badge}</span></p><StreamedText text={event.item} paused={!demoStream.enabled} /></div></div>)}</div>
              </section>}
              {isGenerating && <div className="mb-8 flex gap-3.5"><AssistantMark small /><div className="pt-1 text-sm text-neutral-400"><span className="mr-2 inline-flex gap-1"><i className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.2s]" /><i className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.1s]" /><i className="size-1.5 animate-bounce rounded-full bg-neutral-400" /></span>{t.generating}</div></div>}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="shrink-0 px-4 pb-3 pt-2 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[22px] border border-neutral-300 bg-white px-3 pb-2 pt-3 shadow-[0_8px_28px_rgba(0,0,0,0.07)] transition focus-within:border-neutral-400">
              <textarea ref={inputRef} value={input} onChange={(event) => { setInput(event.target.value); event.currentTarget.style.height = 'auto'; event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 180)}px` }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage() } }} rows={1} placeholder={t.placeholder} className="max-h-[180px] min-h-8 w-full resize-none bg-transparent px-2 text-sm leading-6 text-neutral-800 outline-none placeholder:text-neutral-400" />
              <div className="flex items-center justify-between pt-1">
                <span className="pl-2 text-[10px] text-neutral-400">/news · /gossip · /novel</span>
                <button type="button" aria-label={t.sendMessage} disabled={!input.trim() || isGenerating} onClick={() => void sendMessage()} className="grid size-8 place-items-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"><ArrowUp size={17} /></button>
              </div>
            </div>
            <p className="mt-2 hidden text-center text-[10px] text-neutral-400 sm:block">{t.disclaimer}</p>
          </div>
        </div>
      </section>
      </div>
    </main>
  )
}