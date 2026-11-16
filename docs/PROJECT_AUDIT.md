# WorkingNow 项目现状审计

审计日期：2026-11-16  
范围：Sprint 0，只分析现状；本次没有修改业务代码。

## 1. 结论摘要

当前仓库是一个 Next.js App Router 项目，主要产品仍是此前的“办公室伪装工作区”演示：AI 聊天式界面、VS Code 风格页面、模拟 Excel 工作簿和 Outlook 静态页面。它尚未实现任务书定义的 Meeting Companion、Everyday Work Tools、Workday Break 或 Discover 功能。

可以直接复用的基础包括 Next.js 16 App Router、TypeScript、Tailwind CSS 4、基础组件、五种语言的文案、Next Metadata Route、Vercel Analytics 和响应式布局写法。改造时最重要的约束是保留当前已经存在的本地化工作区 URL 和静态 Outlook 入口，不要将不相关的旧页面批量重定向到首页。

当前主要风险：

1. `/` 的旧页面与 locale proxy 约定不一致：根页面代码期望存在 `params.lng`，而根路由没有该参数；proxy 目前会将 `/` 按浏览器语言重定向到 `/{lng}`。
2. 根布局仍使用 Create Next App 默认 Metadata，locale 子页面只有部分页面级 metadata，Canonical、Open Graph、结构化数据不完整。
3. sitemap 只列站点根路径和五个 locale 首页，不含已存在的工作区子页面；robots 中部分路径规则与 locale URL 不对应。
4. 当前多数页面是交互式视觉演示，并非可完成真实工作的工具；没有测试文件、持久化偏好或收藏/最近使用能力。
5. `npm run lint` 失败；`npm run build` 成功但提示 Next.js 检测到仓库外的另一个 lockfile 并误选 workspace root。

## 2. 技术栈与项目配置

| 项目 | 当前情况 |
|---|---|
| Next.js | `16.2.9`，使用 App Router；根目录 `proxy.ts` 使用 Next.js 16 命名的 Proxy 约定 |
| React | `19.2.4` |
| 语言 | TypeScript 5，`strict: true`，启用 `resolveJsonModule` 和 `@/*` 路径别名 |
| 样式 | Tailwind CSS 4、`@tailwindcss/postcss`、`tw-animate-css`、shadcn CSS 变量 |
| UI 与图标 | 自有 `components/ui/*` 组件、Base UI、shadcn、Lucide |
| Analytics | `@vercel/analytics/next`，在根布局全局渲染 |
| 依赖管理 | npm，存在 `package-lock.json` |
| 部署 | 配置面向 Next.js/Vercel；没有 `vercel.json`，`next.config.ts` 当前无实质配置 |
| 测试 | 未发现单元测试或端到端测试文件；`package.json` 没有 test 脚本 |
| CI/CD | `.github/workflows/update_gossip.yml` 每小时运行内容抓取并将生成数据提交回仓库 |

项目结构中没有 `src/` 层。主要源代码位于 `app/`、`components/`、`lib/`，静态内容位于 `public/`。工作区的 Next.js 版本配套文档已核对：Next.js 16 将 Middleware 更名为 Proxy，当前 `proxy.ts` 的文件约定与版本一致。

## 3. 当前路由和可访问内容

`proxy.ts` 根据 `Accept-Language` 将不带语言前缀的普通页面重定向到支持的 locale：首页通常会进入 `/en`、`/zh`、`/ja`、`/ms` 或 `/vi`。它排除了包含文件扩展名的 URL、`/vscode`、`/outlook`、`/MSOutlookit` 等路径，因此这些请求不经 locale 重定向。

| 当前 URL | 实际页面/行为 | 备注 |
|---|---|---|
| `/` | proxy 根据请求语言重定向到 `/{lng}`；应用本身另有静态根页面 | `app/page.tsx` 是旧企业仪表盘，代码期望 `params.lng`；它与当前根路由及 locale 首页实现不一致 |
| `/{lng}` | Workspace 首页 | `lng` 对应 en、zh、ja、ms、vi；展示四个工作区入口 |
| `/{lng}/ai-workspace` | AI Workspace 演示 | 客户端页面；回答由本地模板产生，没有 AI 服务；对话只保存在 React 状态中 |
| `/{lng}/vscode` | Developer Studio 演示 | 客户端页面；从 `/gossip.json` 读取内容并展示本地模拟代码流 |
| `/{lng}/excel` | 模拟财务工作簿 | 数据在组件内构造；部分数值会随演示计时器变化，不是可编辑电子表格 |
| `/{lng}/outlook` | Outlook 风格页面 | 页面用 iframe 加载 `/MSOutlookit/index.html` |
| `/vscode` | 另一套旧版 VS Code 伪装页面 | 和 `/{lng}/vscode` 使用不同实现；英文、静态展示，不走 locale proxy |
| `/MSOutlookit/index.html` | `public/` 下的独立 Outlook 静态克隆 | 附有静态 HTML、JS、图片和 jQuery UI 资源 |
| `/robots.txt` | App Metadata Route | 由 `app/robots.tsx` 生成 |
| `/sitemap.xml` | App Metadata Route | 由 `app/sitemap.ts` 生成 |
| `/google3327b0cf9e781d81.html` | Google 验证静态文件 | 位于 `public/` |
| `/gossip.json` | 客户端可读取的公开 JSON | 目前内容来自定时抓取的第三方娱乐新闻 RSS |

旧路径没有与任务书新工具直接等价的映射。尤其不应把 VS Code、AI Workspace、Excel 或 Outlook 页面自动重定向到“会议工具”或首页；只有在新页面功能真实对应、旧 URL 价值核实后才制定逐条迁移规则。

## 4. 现有模块、组件和依赖关系

### 页面与业务演示

- Locale 首页由 `app/[lng]/page.tsx` 渲染，经 `lib/translations.ts` 读取五种语言的 JSON 文案；首页入口分别指向 AI、Developer、Finance 和 Mail 工作区。
- AI Workspace 位于 `app/[lng]/ai-workspace/page.tsx`。它包含侧栏、对话列表、输入框、复制操作和紧急伪装视图；对话只存在组件状态里，普通回答为预设规则和模板文本。`/news`、`/gossip` 命令从公开 JSON 随机选取内容。
- `components/vscode-skin.tsx` 是当前 locale Developer 页面；`app/vscode/page.tsx` 则加载另一套独立的旧版 VS Code 页面。它们不共享主要渲染实现。
- `components/excel-workbook.tsx` 展示固定区域数据、公式栏和演示数值变化；控件主要是外观元素，非工作表编辑功能。
- `app/[lng]/outlook/page.tsx` 只提供外层导航与 iframe；真正内容由 `public/MSOutlookit/` 管理。

### 共用组件与库

- `components/stealth-nav.tsx`：语言版工作区导航，依赖翻译字典、语言选择器和演示开关。
- `components/language-switcher.tsx`：在当前 pathname 上替换第一段 locale。
- `components/demo-mode.tsx`、`components/demo-mode-toggle.tsx`：管理演示启停、Escape 行为及自动轮播样例。
- `components/VisitorCounter.tsx`：当前标签页访问计数和已浏览路径计数。
- `components/ui/`：avatar、button、card、dialog、separator、table、tabs 等基础 UI。
- `lib/translations.ts` 与 `app/i18n/locales/*.json`：共享的五语言翻译类型和文案。
- `lib/utils.ts`：Tailwind class 合并工具。

### 当前没有的任务书模块

未发现世界时钟、时区转换、会议规划/倒计时/计时器、工作日计算器、计算器/文本处理工具、随机分组/抽选、2048、数独、扫雷、休息计时器、Discover 内容页面或相关算法、游戏成绩记录。

## 5. 国际化、存储和数据流

- 支持 locale 为 `en`、`zh`、`ja`、`ms`、`vi`，默认 `en`。`app/i18n/settings.ts` 和 `lib/translations.ts` 都维护 locale 列表，存在重复维护点。
- locale 根页面通过 `/{lng}` 组织；若改为英语优先的无前缀 URL，需要明确 `/en`、其他 locale URL 和未来本地化路径策略，不能直接删除现有 URL。
- 根 `app/layout.tsx` 的 `<html lang>` 固定为 `en`，locale layout 没有按当前路径更新 HTML 语言属性。
- 仅发现 `VisitorCounter` 使用 `sessionStorage`，存储键带 `v1` 版本标记，且使用 `useSyncExternalStore` 的服务端快照避免 SSR 直接读取浏览器对象。没有 `localStorage`、Cookie 设置或统一存储封装。
- AI 对话、演示 toggle 状态、游戏/工具数据没有持久化；没有收藏、最近使用和偏好数据结构。
- `/gossip.json` 由 `fetch_gossip.py` 从第三方 XML 源抓取并写入 `public/gossip.json`；GitHub Actions 每小时更新并 commit/push。该流程不是纯静态前端的数据维护方式，也带来第三方内容授权、来源可靠性、提交噪声和构建更新延迟等运营问题。

## 6. 样式、响应式和可访问性

- 主样式入口为 `app/globals.css`，基于 Tailwind 4 与 CSS 变量，定义浅色与 `.dark` 变量；尚无主题设置流程。
- 新版 locale 页面使用 Tailwind 响应式断点、`min-h-dvh`、可滚动导航等方式适配小屏；AI 侧栏会在小屏切换为抽屉式侧栏。
- 固定高度工作区页面（AI、Developer、Excel）需要在窄屏、缩放、虚拟键盘和较短视口下专项回归；Excel 工作表使用 `min-w-[1050px]`，移动端依赖横向滚动。
- 老 `/vscode` 实现采用全屏桌面布局和固定侧栏，移动端适配有限；Outlook 静态 HTML 是否满足当前移动端需求，需单独检查静态资源和嵌入交互。
- 新版导航、按钮和部分图标有 aria 标签；旧页面主要使用视觉元素和非交互 `span`，不能作为新工具的可访问性实现范本。

## 7. Metadata、SEO 与爬虫规则

- 根布局仍声明 `Create Next App` / `Generated by create next app`，与产品定位不符。
- locale 首页有页面级 title/description；locale 子页面多数只有 title、没有 description；常规页面没有完整 Open Graph 或 JSON-LD。
- `app/page.tsx` 中存在一套旧版 canonical/alternate 语言 Metadata，但它生成于根页并期望 `params.lng`，与首页 locale 路由职责不匹配。新 locale 首页没有对应 canonical 和 hreflang。
- `sitemap.ts` 只返回根 URL 和五个 locale 首页；`lastModified: new Date()` 会随生成时间变化，不表示页面真实更新时间；没有列出实际 locale 子页面。
- `robots.tsx` 允许全站抓取并设置 sitemap；排除规则包含 `/*/vscode`、`/outlook/`、`/gossip.json`。实际 Outlook 页面在 `/{lng}/outlook`，而 VS Code 页面同时有 `/vscode` 和 `/{lng}/vscode`，规则需结合预期索引政策校准。
- 未发现站内 Breadcrumb、产品工具页结构化数据、工具间推荐链接或 SEO 页面质量检查流程。
- Google 验证文件已存在；没有依据确认 Google Search Console 是否已完成接入。

## 8. 部署和工程验证

执行环境：Node/npm 已安装依赖；工作区 Next.js 版本为 `16.2.9`。

| 命令 | 结果 |
|---|---|
| `npm run build` | 成功；输出 `/`、`/[lng]`、四个 locale 子路径、`/vscode`、robots、sitemap。构建警告：Next.js 选择了仓库外 `/Users/liqian/package-lock.json` 作为 workspace root，同时检测到本仓库 lockfile。 |
| `npm run lint` | 失败；`app/page.tsx:109` 有两个未转义引号错误；`app/vscode/page.tsx:14` 有未使用的 `err` 警告。Sprint 0 不修复这些业务文件。 |
| 测试 | 未发现测试脚本或测试文件。 |

没有专用 `vercel.json`；项目依赖 Vercel 对 Next.js 的默认构建与部署支持。`next.config.ts` 目前为空配置。GitHub Action 具备向仓库写入权限，用于抓取并提交内容，而不是应用部署测试流水线。

## 9. 主要技术债务与处理建议

| 领域 | 现状/债务 | 建议 |
|---|---|---|
| 产品与路由 | 旧产品模型为伪装工作区，和目标信息架构不一致；根页与 locale 首页职责重复 | 先确定路由兼容矩阵，再采用目标 `/meetings`、`/tools`、`/break`、`/discover` 逐步增加实际页面 |
| 首页入口 | 新版 locale 首页与旧根首页并存 | 先统一根路由/locale 入口行为与 metadata，不拆除旧内容 URL |
| 工具架构 | 没有工具类型、分类、元数据或统一页面壳 | 在 Sprint 1 建立轻量元数据类型、卡片和布局；避免先建大型插件框架 |
| 日期时区 | 尚无业务实现及测试 | 用 IANA 时区和 Intl API，先建立纯函数及 DST、日期跨越测试，再接入交互页面 |
| 用户数据 | 没有统一本地存储、收藏或最近使用；现有状态大多只在组件内 | 建立带 schema 版本的浏览器存储封装，隔离 SSR，定义迁移/损坏数据处理规则 |
| 国际化 | locale 清单重复；HTML lang 固定英文；目标阶段以英文为先 | 先保留旧 locale URL 与文案；新工具先做好英文页面，不因 Sprint 1 扩大完整 i18n 架构 |
| SEO | 默认 metadata、canonical/hreflang 缺漏、sitemap 不完整 | 为每个有真实价值的工具页面配置 title/description/canonical/OG；维护 URL 清单驱动 sitemap |
| 内容和外部依赖 | 定时爬取第三方内容并直接发布到公开静态 JSON | 按任务书改为自有/授权的小规模 Discover 数据；如无合法稳定来源则停用旧采集链路 |
| UI/响应式 | 有可复用的 Tailwind 与基础组件，旧页面和桌面布局混杂 | 统一新模块的导航、页面容器和移动端交互；旧体验只在迁移映射明确前保留 |
| 测试/质量门禁 | 无测试套件，lint 当前失败 | 先清理 lint 基线，再为日期/时区、计算器、文本处理、存储和随机算法添加单元测试 |
| 工程配置 | build root 受仓库外 lockfile 影响 | 明确 Next 16 Turbopack root 设置或清理不属于本项目的锁文件来源；避免在审计阶段改动父目录 |

## 10. Sprint 0 交付边界

本审计只新增 `docs/PROJECT_AUDIT.md` 与 `docs/REFACTORING_PLAN.md`。未修改页面、组件、依赖、路由、样式、爬虫或 CI 配置。建议进入 Sprint 1 前先确认 URL 保留与重定向策略，之后再开始增量实现。
