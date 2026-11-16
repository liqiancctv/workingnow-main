# WorkingNow 增量改造计划

基于 [PROJECT_AUDIT.md](./PROJECT_AUDIT.md) 制定。此文档是实施顺序与验收建议，不代表已开始 Sprint 1。

## 1. 改造原则

1. **先守住已有 URL，再新增产品 URL。** 已有 `/{lng}`、`/{lng}/ai-workspace`、`/{lng}/vscode`、`/{lng}/excel`、`/{lng}/outlook`、`/vscode` 和 `/MSOutlookit/index.html` 均纳入路由清单。不得用通用首页重定向替代旧路径。
2. **只对内容等价页面做 301。** 旧路由没有对应新工具时，暂时保留原页或在确认流量、索引、外链后再决定处理方式；不要将伪装工作区重定向到无关的会议工具。
3. **交付真实功能优先。** 新页面须具备可验证的输入、输出和说明；未实现的功能不应以“已可用”展示在导航、sitemap 或搜索结果中。
4. **纯前端、无账号、无数据库。** 日期时间与工具计算尽量做成纯函数，所有个人偏好仅在用户设备本地保存；不得收集工具输入文本。
5. **贴合 Next.js 16。** 继续使用 App Router 与项目根目录 `proxy.ts`，依据当前安装版本的文档处理异步 route params、Metadata、Proxy 与 metadata 文件约定。
6. **增量替换，不为架构而架构。** 保留 Tailwind、Lucide 与可复用基础 UI；只有出现多个真实调用方时才抽取共享业务抽象。

## 2. URL 兼容策略（开工前基线）

### 新 URL

按任务书新增：

- `/meetings/` 和 `/meetings/{world-clock,time-zone-converter,meeting-planner,meeting-countdown,meeting-timer,working-days-calculator,date-time-calculator}/`
- `/tools/` 和 `/tools/{percentage-calculator,growth-rate-calculator,word-counter,text-case-converter,text-compare,random-team-generator,random-picker}/`
- `/break/` 和 `/break/{2048,sudoku,minesweeper,5-minute-break}/`
- `/discover/` 和 `/discover/{daily-trivia,interesting-facts,office-humor,quick-quiz}/`
- `/about/`、`/privacy/`、`/terms/`

### 现有 URL

| 现有路由 | 初始处理建议 | 后续处理条件 |
|---|---|---|
| `/` | 设为英语默认入口，并保留语言协商行为的明确规则 | 用手动/自动化检查确认根请求、浏览器语言和搜索爬虫行为一致 |
| `/en` | 可在英语首页内容与 canonical 稳定后 301 到 `/` | 搜索索引与外链检查通过；不与 proxy 形成重定向循环 |
| `/zh`、`/ja`、`/ms`、`/vi` | 在这些 locale 暂时保留期间继续服务原翻译内容；不要默认重定向到英文 | 只有有计划停用该语言且确认 Search Console 和外链影响后再迁移 |
| `/{lng}/ai-workspace` | 保留旧体验或提示旧模块状态；不映射到不等价工具 | 若以后有实际同名产品，先内容核对再定向 |
| `/{lng}/vscode`、`/vscode` | 保留两条旧 URL，避免因同名不同实现导致错误迁移 | 先确定是否继续支持该演示；不得默认重定向到 `/tools/` 或 `/break/` |
| `/{lng}/excel` | 保留现有财务工作簿入口 | 新增的百分比/增长率工具并不等价，不作为自动重定向目标 |
| `/{lng}/outlook`、`/MSOutlookit/index.html` | 保留 iframe 和静态旧入口 | 只有旧 Outlook 产品下线且替代内容明确后才制定逐条重定向 |

部署后应对旧 URL 和新 URL 做状态码、最终 URL、canonical、页面内容与 robots 验证。不可将“首页能打开”视作 URL 迁移已完成。

## 3. 分阶段实施

### Gate 0：审计问题收口

**范围**

- 建立当前/目标 URL 对照表及明确的保留、别名、redirect、暂不处理策略。
- 决定新英文产品首页 `/` 与现存多语言首页的并存方式。
- 修复工程门禁前，记录当前 lint 错误基线；确认仓库外 lockfile 的处理责任人，不在不确定时操作父目录。
- 为旧爬虫数据确认授权与是否继续保留。

**验收**

- 所有现存页面 URL 有明确处置状态。
- `/` 与 `/{lng}` 不产生循环跳转或错误的 locale 判断。
- 不执行对外部 lockfile 的删除或修改，除非明确确认归属。

### Sprint 1：产品基础架构

**建议结构**

- 页面继续按 App Router 路由组织；按 `meetings`、`tools`、`break`、`discover` 分模块。
- 增加轻量工具元数据定义：`id`、`name`、`slug`、`category`、`description`、`keywords`、`estimatedUsageTime`、`icon`、`seoTitle`、`seoDescription`、`status`。
- 建立统一 Header/Navigation/Footer、首页分区、分类入口和工具卡片；当前 `StealthNav` 保持旧页面兼容，不强行改成新产品导航。
- 建立统一页面介绍/操作说明和错误、空状态样式。
- Metadata 应由工具元数据或页面数据驱动，并避免根页面与 locale layout 重复生成同一 title。
- 建立统一本地存储模块：数据 envelope 带 schema version；SSR 固定快照；storage 不可用/JSON 损坏需可见地回退并保留错误处理，不静默覆盖用户数据。
- 在本地存储上实现收藏和最近使用，分别处理隐私、重复访问、排序及容量边界。

**验收**

- 新导航能到达明确的分类页与工具页；尚未实现工具不得标记可用。
- SSR 和首次 hydration 不因访问 `window`、`localStorage` 而产生异常或界面闪烁。
- 收藏/最近使用可在刷新后恢复，并有版本升级测试。
- 现有 locale 路由与静态 Outlook 入口不回归。

### Sprint 2：Meeting Companion

**实现顺序**

1. 以 `Intl.DateTimeFormat` 和 IANA 时区标识实现 World Clock；不存固定 UTC offset。
2. 实现 Time Zone Converter 的本地日期时间解析、时区选择、跨日结果和歧义/不存在的当地时间提示。
3. 实现 Meeting Planner，逐参与者维护工作时间区间；候选时间解释为满足配置条件的时段，不声称未经验证的“最佳”。
4. 实现倒计时与计时器，处理暂停/恢复、后台标签页、结束提示和本地保存。
5. 实现 Working Days Calculator 与 Date & Time Calculator，公开展示周末、周工作日和节假日规则。

**验收**

- 每项工具有独立 URL、真实使用说明、移动布局和空/错误状态。
- 纯函数覆盖 DST 转换、跨日、闰年、月末、负时长/负增长、无效日期、重复/不存在的本地时间等边界。
- 推荐时段能够指出使用了哪些工作时间区间和会议时长。
- 收藏和偏好仅写入浏览器本地，不上传参与者或会议数据。

### Sprint 3：Everyday Work Tools

依次实现百分比、增长率、字数统计、文本大小写、文本比较、随机分组与随机抽选。将计算逻辑独立于页面组件，定义空输入、负数、零分母、语言字词分隔、重复抽取等规则。复制按钮需报告浏览器不支持/权限拒绝的错误，并提供可选手动选择体验。

**验收**

- 每个工具有独立 URL、输入输出说明、重置操作和至少一组精确结果测试。
- 文本仅在浏览器处理，不发送到 analytics、外部 API 或服务端日志。
- 移动端输入框、结果区域与复制操作可正常使用。

### Sprint 4：Workday Break

- 先确认是否存在可保留的游戏逻辑；审计发现的 `2048`、Sudoku、Minesweeper 实现数量为零，不能按“已有游戏”假设接入。
- 为游戏定义统一壳、开始/暂停/重开和键盘/触摸交互约定。
- 逐个实现游戏并用纯逻辑模块隔离状态转移；加入本地最高成绩/历史记录。
- 实现 5 分钟休息计时器；Relaxing Sounds 仅在有合法资源与明确无障碍控制后考虑。

**验收**

- 游戏开始无需登录、广告或外部网络。
- 移动触摸、键盘和重新开始流程经过验证。
- 本地成绩数据有 schema 版本，不同游戏记录互不覆盖。

### Sprint 5：Discover

- 采用静态 TypeScript/JSON 内容数据结构，首批控制规模，包含内容 id、类型、正文、作者/授权来源、发布日期或适用日期、相关链接。
- 提供每日 Trivia、Interesting Facts、Office Humor、Quick Quiz 页面。
- 分享功能只分享内容 URL 或由用户确认的文本；不引入复杂 CMS 和用户生成内容后端。
- 停用未确认授权的第三方娱乐新闻抓取，不把旧 `gossip.json` 直接作为趣味内容库。

**验收**

- 每项内容有来源/授权记录和独立 metadata。
- 没有依赖每小时抓取才能正常显示的页面。
- 分享与复制动作在移动端可使用且失败有反馈。

### Sprint 6：留存与偏好

- 增加首页搜索、分类筛选、收藏和最近使用。
- 采用与 SSR 兼容的 schema-versioned local storage；为损坏、容量不足、用户清理存储及未来升级设计行为。
- 深色/浅色主题只有在当前设计变量体系和首屏 hydration 策略经过验证后再启用。
- 建立模块间相关推荐，不影响工具独立使用。

### Sprint 7：SEO 与全球化

- 默认英文优先，不在第一阶段把五种旧 locale 全面翻译为新工具。
- 保留已有 locale URL 的兼容策略，逐页面维护 title、description、canonical、Open Graph、robots 和必要的 hreflang。
- Sitemap 只包含可索引且已有实质功能的 URL；更新时间使用真实内容更新时间或不提供虚假频繁更新时间。
- 加入 BreadcrumbList；仅在 schema 与页面内容吻合时添加其他结构化数据。
- 为每个工具页提供有用介绍、规则、例子和相关工具内链。
- Google Search Console 状态需由站点所有者确认；访问令牌等凭证不得放入客户端代码。

### Sprint 8：分析

- 统一管理 Vercel Analytics/GA4，先确定同意策略，再加载相应的非必要统计。
- 仅采集工具 id、分类、动作、时长、入口来源等最小事件属性；禁止采集用户输入文本、会议内容或原始候选名单。
- 事件包含 `tool_open`、`tool_use`、`tool_complete`、`tool_copy`、`tool_favorite`、`tool_search`、`game_start`、`game_complete`、`break_start`、`discover_view`。
- 将当前 `VisitorCounter` 的 sessionStorage 页面计数与产品分析事件区分；它不代表全球访问量，不应标注为真实用户分析。

## 4. 工程质量和回归门禁

每个 Sprint 使用适用的最小验证集：

1. `npm run lint` 无新增错误；修复现有基线问题时需单独审阅，不把审计文档任务扩大为无关重构。
2. `npm run build` 成功，Next.js workspace root 警告已确认处理方式。
3. 新增纯逻辑单元测试；重点覆盖时区/DST、日期、数值边界、随机分配、文本统计和本地存储迁移。
4. 路由 smoke test 检查旧 URL 与新增页面的状态码、跳转目标和 metadata。
5. 在窄屏 viewport 检查导航、输入、结果、滚动区域、键盘/触摸可用性。
6. 检查 sitemap 与 robots 输出，确保无未实现页面、无错误禁抓和无 canonical/locale 循环。

## 5. Sprint 1 的建议启动顺序

1. 确认第 2 节路由兼容矩阵，尤其是 `/`、`/en` 和其余四种 locale 的关系。
2. 建立新首页与新导航，暂时不移除旧 workspace 页和静态 Outlook 资产。
3. 先完成 Metadata 约定与 sitemap/robots 的数据源规则。
4. 再定义工具元数据和分类卡片。
5. 最后实现本地存储 envelope、收藏与最近使用，并为 SSR/hydration 写测试。

该顺序让首页、SEO、工具页面和本地偏好共享一套清晰约定，同时避免在工具业务开始后反复迁移 URL 或用户数据结构。
