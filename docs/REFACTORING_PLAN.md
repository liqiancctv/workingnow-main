# WorkingNow 全球化产品开发任务书

**项目名称：** WorkingNow  
**产品定位：** Your everyday workday companion.  
**目标市场：** Global  
**核心用户：** 全球办公室职员、远程办公者、跨时区团队成员  
**商业模式：** 初期免费使用 + 广告变现，后续探索高级功能  
**技术基础：** Next.js + Vercel + 纯前端架构

---

# 一、产品战略与开发原则

## 1.1 产品定位

WorkingNow 是一个面向全球职场人的轻量工作日伴侣。

帮助用户：
- 更方便地完成工作中的小任务。
- 更轻松地处理跨时区会议和协作。
- 快速使用日常办公工具。
- 在工作间隙获得短暂休息和娱乐。

产品核心体验：

- Fast：打开即用。
- Simple：无需学习。
- Useful：真正解决问题。
- Enjoyable：使用体验轻松愉快。

## 1.2 产品功能结构

### 模块 A：Meeting Companion（核心业务）

跨时区会议与工作协作工具。

第一批功能：
1. World Clock：全球时钟。
2. Time Zone Converter：时区转换。
3. Meeting Time Planner：跨时区会议时间规划。
4. Meeting Countdown：会议倒计时。
5. Meeting Timer：会议计时器。
6. Working Days Calculator：工作日计算器。
7. Date & Time Calculator：日期时间计算器。

### 模块 B：Everyday Work Tools（扩展业务）

办公室日常轻量工具。

第一批功能：
1. Percentage Calculator：百分比计算器。
2. Growth Rate Calculator：增长率计算器。
3. Word Counter：字数统计。
4. Text Case Converter：文本大小写转换。
5. Text Compare：文本对比。
6. Random Team Generator：随机分组。
7. Random Picker：随机抽选。

后续候选：
- Image Compressor
- Image Format Converter
- Color Converter
- Gradient Generator
- Unit Converter
- QR Code Generator

注意：后续候选不属于第一期必须交付范围。

### 模块 C：Workday Break（休息与娱乐）

让用户在工作间隙获得短暂休息。

第一批功能：
1. 2048。
2. Sudoku。
3. Minesweeper。
4. 5-Minute Break Timer。
5. Relaxing Sounds（如现有资源和实现条件允许）。

### 模块 D：Discover（趣味内容）

提供轻量、可分享、有一定更新价值的趣味内容。

第一批功能：
1. Daily Trivia：每日趣味问题。
2. Interesting Facts：趣味知识。
3. Office Humor：办公室幽默。
4. Quick Quiz：轻量测试。

初期以高质量、有限数量的内容验证需求，不建设复杂的内容管理系统，不引入后端。

---

# 二、产品信息架构

建议的一级导航：

- Home
- Meetings
- Tools
- Break
- Discover

建议 URL：

/
 
/meetings/

/meetings/world-clock/

/meetings/time-zone-converter/

/meetings/meeting-planner/

/meetings/meeting-countdown/

/meetings/meeting-timer/

/meetings/working-days-calculator/

/tools/

/tools/percentage-calculator/

/tools/growth-rate-calculator/

/tools/word-counter/

/tools/text-case-converter/

/tools/text-compare/

/tools/random-team-generator/

/tools/random-picker/

/break/

/break/2048/

/break/sudoku/

/break/minesweeper/

/break/5-minute-break/

/discover/

/discover/daily-trivia/

/discover/interesting-facts/

/discover/office-humor/

/about/

/privacy/

/terms/

以上为目标 URL 结构，必须先检查现有项目路由。已有页面如果存在有价值的 URL，应优先保留并建立合理的重定向策略，不要无理由修改已经被搜索引擎收录的地址。

---

# 三、开发阶段与任务列表

## Sprint 1：产品基础架构

目标：建立清晰、可扩展的产品结构。

任务：

1. 根据项目实际情况建立统一的页面和模块组织方式。
2. 建立统一的 Header、Navigation、Footer。
3. 建立统一的页面布局。
4. 建立统一的工具卡片。
5. 建立统一的工具分类。
6. 建立统一的工具元数据结构。
7. 建立统一的页面 Metadata 规范。
8. 建立统一的本地存储封装。
9. 建立收藏和最近使用功能。
10. 建立统一的错误处理和空状态。

工具元数据建议包含：

- id
- name
- slug
- category
- description
- keywords
- estimatedUsageTime
- icon
- seoTitle
- seoDescription
- status

设计原则：

- 页面与具体工具业务逻辑分离。
- 工具之间尽量独立。
- 新增工具不应影响已有工具。
- 统一使用 TypeScript 类型。
- 不为了架构完整而引入不必要的抽象。

## Sprint 2：Meeting Companion 核心功能

目标：建立 WorkingNow 第一个具有明确场景价值的产品模块。

开发顺序：

### 2.1 World Clock

功能：
- 显示多个城市的当地时间。
- 支持添加和删除城市。
- 支持搜索城市。
- 显示城市名称、时区和日期。
- 支持 12 小时和 24 小时格式。
- 支持收藏常用城市。
- 支持用户本地时区自动识别。

要求：
- 正确处理夏令时。
- 不要手工维护固定 UTC 偏移。
- 优先使用浏览器 Intl API 和 IANA 时区标识。

### 2.2 Time Zone Converter

功能：
- 输入日期和时间。
- 选择源时区。
- 选择目标时区。
- 显示转换结果。
- 支持多个时区同时对照。
- 显示日期跨越和夏令时变化。

### 2.3 Meeting Time Planner

功能：
- 选择多个城市或时区。
- 选择会议日期。
- 设置会议时长。
- 展示各时区对应时间。
- 标记合理工作时间和非工作时间。
- 推荐所有参与者相对合适的时间段。
- 支持切换日期查看结果。

重要要求：

- 明确区分当地时间与 UTC。
- 正确处理夏令时。
- 不要把所有国家默认工作时间视为一致。
- 用户可以调整各参与者的工作时间范围。
- 推荐结果必须说明依据，不得将未经验证的时间称为最佳会议时间。

### 2.4 Meeting Countdown

功能：
- 设置会议日期和时间。
- 显示剩余时间。
- 支持暂停、恢复和重置。
- 支持浏览器本地保存。
- 支持多个倒计时。

### 2.5 Meeting Timer

功能：
- 开始、暂停、恢复和重置。
- 支持预设会议时长。
- 支持会议阶段计时。
- 提供清晰的结束提示。
- 不依赖服务器。

### 2.6 Working Days Calculator

功能：
- 计算两个日期之间的工作日。
- 支持自定义每周工作日。
- 支持用户输入节假日。
- 支持排除周末。
- 清楚展示计算规则。

### Sprint 2 验收标准

- 所有工具可独立访问。
- 计算结果准确。
- 日期和时区逻辑经过测试。
- 支持移动端。
- 不需要注册账号。
- 不需要后端服务。
- 收藏和用户偏好可以本地保存。

## Sprint 3：Everyday Work Tools

目标：扩展工作日常工具，形成搜索入口。

开发顺序：

### 3.1 Percentage Calculator

- 百分比计算。
- 百分比变化。
- 增长和下降比例。
- 支持小数和负数。
- 清晰展示计算结果。

### 3.2 Growth Rate Calculator

- 输入初始值和最终值。
- 计算增长率。
- 支持负增长。
- 展示计算公式。
- 支持多期增长率计算。

### 3.3 Word Counter

- 实时统计字符数。
- 统计单词数。
- 统计句子数。
- 统计段落数。
- 支持粘贴和清空。
- 明确不同语言的统计规则。

### 3.4 Text Case Converter

- UPPERCASE。
- lowercase。
- Title Case。
- Sentence case。
- 复制转换结果。

### 3.5 Text Compare

- 输入两段文本。
- 展示差异。
- 高亮新增和删除内容。
- 支持清空和复制。

### 3.6 Random Team Generator

- 输入参与者名单。
- 设置分组数量或每组人数。
- 随机分组。
- 支持重新抽取。
- 支持复制结果。

### 3.7 Random Picker

- 输入候选项。
- 随机选择结果。
- 支持重复和不重复抽取。
- 支持复制结果。

验收标准：

- 每个工具均有独立 URL。
- 输入和输出逻辑准确。
- 支持复制、重置等常见操作。
- 不上传用户输入内容。
- 移动端使用正常。
- 不同工具之间互不干扰。

## Sprint 4：Workday Break

目标：建立工作间隙的休息体验。

任务：

1. 盘点现有 2048 游戏。
2. 盘点现有 Sudoku 游戏。
3. 盘点现有 Minesweeper 游戏。
4. 统一游戏页面布局。
5. 统一开始、暂停、重开功能。
6. 建立游戏历史记录。
7. 建立最高成绩本地保存。
8. 建立 5-Minute Break Timer。
9. 适配移动端触摸操作。
10. 增加游戏之间的推荐入口。

游戏原则：

- 游戏应快速进入。
- 不要求用户注册。
- 不应强迫用户观看广告才能开始游戏。
- 不要在游戏操作按钮周围放置广告。
- 休息功能应轻量，不发展为大型游戏平台。

## Sprint 5：Discover 内容模块

目标：提供有趣、轻量、适合分享的内容。

任务：

1. 建立趣味内容数据结构。
2. 建立每日趣味问题。
3. 建立趣味知识展示。
4. 建立办公室幽默内容。
5. 建立轻量测试页面。
6. 建立内容分类。
7. 建立内容之间的推荐关系。
8. 建立分享链接和复制功能。
9. 为内容建立独立 Metadata。

内容要求：

- 优先原创或明确具有合法使用权的内容。
- 不直接复制其他网站的段子和文章。
- 不使用未经授权的图片。
- 不依赖频繁手动更新才能维持基本功能。
- 初期控制内容规模，先验证用户兴趣。

## Sprint 6：产品体验与留存

目标：让用户从一次性访问转变为重复使用。

任务：

1. 首页展示 Meetings、Tools、Break、Discover。
2. 增加搜索工具功能。
3. 增加工具分类导航。
4. 增加收藏功能。
5. 增加最近使用功能。
6. 增加最近游戏记录。
7. 增加用户偏好设置。
8. 支持深色和浅色主题（视现有设计体系决定）。
9. 增加适当的相关工具推荐。
10. 增加返回首页和模块间导航。

注意：

- 不要求用户登录。
- 不搭建后端。
- 不引入数据库。
- 不做复杂的个人中心。
- 本地存储必须考虑 SSR 和 Hydration。
- 本地数据结构需要版本管理，避免未来升级时造成数据丢失。

## Sprint 7：SEO 与全球化

目标：让独立工具页面可以被搜索引擎发现、理解和收录。

任务：

1. 每个页面配置独立 Title。
2. 每个页面配置独立 Description。
3. 配置 Canonical。
4. 配置 Open Graph。
5. 配置 Sitemap。
6. 配置 Robots。
7. 建立 BreadcrumbList 结构化数据。
8. 对适合的工具页面添加合理的结构化数据。
9. 确保首屏有真实可读的页面介绍。
10. 建立工具之间的内部链接。
11. 检查移动端 Core Web Vitals。
12. 接入 Google Search Console。
13. 检查索引状态。
14. 建立 SEO 页面质量检查表。

要求：

- 不生成只有关键词、没有真实功能的页面。
- 每个工具页面必须有实际用途。
- 页面应包含使用说明、输入输出、计算规则或操作方法。
- 英文为第一语言。
- 不在第一阶段强行开发完整多语言架构。
- 未来根据真实访问数据决定日语、西班牙语等本地化优先级。

## Sprint 8：数据分析

目标：判断用户是否真正使用产品。

建议接入 GA4，并根据实际需要使用 Vercel Analytics。

建议事件：

- page_view
- tool_open
- tool_use
- tool_complete
- tool_copy
- tool_favorite
- tool_search
- game_start
- game_complete
- break_start
- discover_view

事件参数：

- tool_id
- tool_category
- game_id
- content_id
- duration_seconds
- entry_source

核心指标：

1. 月活跃用户。
2. 自然搜索流量。
3. 工具使用完成率。
4. 收藏率。
5. 7 天回访率。
6. 每用户使用工具数量。
7. 每用户页面浏览量。
8. 不同国家和地区的访问情况。

隐私要求：

- 尊重用户同意状态。
- 不上传用户输入的文本、私人内容或其他敏感数据。
- 统计脚本需要统一管理。
- 未取得适当同意时，不执行不必要的追踪。

## Sprint 9：商业化准备

目标：为广告变现建立基础，但不影响产品体验。

任务：

1. 建立统一广告组件接口。
2. 预留广告位置配置。
3. 建立广告展示开关。
4. 建立广告占位组件。
5. 完善 Privacy Policy。
6. 评估 Cookie Consent 需求。
7. 根据目标市场适用的法规和 Google 要求配置同意机制。
8. 为未来 AdSense 接入预留位置。

广告原则：

- 不在工具的主要操作区放置广告。
- 不让广告伪装成工具按钮。
- 不影响工具结果展示。
- 不影响游戏操作。
- 不为了增加 PV 故意拆分操作步骤。
- 在流量和内容质量尚未得到验证之前，不急于接入广告。

本阶段不要求正式上线广告。

---

# 四、项目技术约束

Copilot 必须遵守以下约束：

1. 保留当前 Next.js 版本，除非有充分理由升级。
2. 先检查实际路由架构，不强制从 Pages Router 迁移到 App Router。
3. 保留现有可用功能。
4. 不进行无必要的全项目重写。
5. 不新增后端。
6. 不新增数据库。
7. 不增加用户注册和登录系统。
8. 不引入大型、不必要的第三方依赖。
9. 业务代码尽量模块化。
10. 使用 TypeScript。
11. 统一处理浏览器 API。
12. 避免服务端直接访问 window、document 和 localStorage。
13. 交互页面根据实际需要使用 Client Components。
14. 能使用原生浏览器 API 的地方优先使用原生能力。
15. 保证桌面端和移动端体验。
16. 所有新增依赖必须说明原因。
17. 所有修改必须经过构建和必要测试。
18. 不得删除无法确认用途的旧代码。

---

# 五、推荐的项目结构

以下结构是目标参考，不要求一次性建立所有目录。

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── meetings/
│   ├── tools/
│   ├── break/
│   ├── discover/
│   ├── about/
│   ├── privacy/
│   └── terms/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── homepage/
│   ├── tools/
│   ├── games/
│   ├── ads/
│   └── common/
│
├── features/
│   ├── meetings/
│   ├── work-tools/
│   ├── games/
│   ├── break/
│   └── discover/
│
├── data/
│   ├── tools.ts
│   ├── categories.ts
│   ├── cities.ts
│   └── discover.ts
│
├── lib/
│   ├── storage/
│   ├── analytics/
│   ├── seo/
│   ├── timezone/
│   └── utils/
│
├── hooks/
│   ├── use-favorites.ts
│   ├── use-recent-tools.ts
│   └── use-local-storage.ts
│
└── types/

注意：以现有项目实际结构为准，避免为了匹配上述目录而进行机械式迁移。

---

# 六、测试与交付验收

每个 Sprint 必须完成以下检查：

## 功能检查

- 页面能够正常访问。
- 核心功能可以正常使用。
- 输入和输出准确。
- 错误输入有合理提示。
- 复制功能正常。
- 刷新后需要保留的数据仍然存在。

## 兼容性检查

- 桌面端正常。
- 移动端正常。
- 不同屏幕尺寸下布局合理。
- 浏览器刷新不会破坏页面。
- 时区工具在夏令时场景下正确。

## 技术检查

- TypeScript 检查通过。
- 项目构建通过。
- 不存在明显控制台错误。
- 不存在明显 Hydration 错误。
- 没有不必要的依赖。
- 没有暴露敏感信息。

## SEO 检查

- 页面标题和描述正确。
- Canonical 正确。
- Sitemap 可访问。
- Robots 可访问。
- 内部链接有效。
- 页面有真实可读内容。
- 不存在无意义的重复页面。

## 发布检查

- 本地构建通过。
- Vercel Preview 环境测试通过。
- Production 环境测试通过。
- 旧页面和旧链接未被无故破坏。

---

# 七、Copilot 执行规则

这是整个任务书最重要的部分。

Copilot 不允许一次性执行全部 Sprint。

必须遵循以下流程：

1. 一次只执行一个 Sprint。
2. 一个 Sprint 可以拆分为多个小任务。
3. 每次修改前先分析涉及的文件。
4. 先说明准备修改什么，再执行修改。
5. 每次只处理一个明确的功能范围。
6. 修改后运行对应测试。
7. 如果构建失败，优先修复当前任务引入的问题。
8. 不得为了让构建通过而随意删除旧功能。
9. 完成一个小任务后，输出修改报告。
10. 未经确认，不得自动进入下一个 Sprint。

每个任务完成后必须报告：

- 本次任务目标。
- 修改的文件。
- 新增的文件。
- 删除的文件及删除原因。
- 完成的功能。
- 测试结果。
- 未解决的问题。
- 潜在风险。
- 下一步建议。

如果发现原项目结构与任务书不一致：

先说明差异和影响，提出适配方案，不得直接大规模重构。

---

# 八、第一期实际交付范围

第一期不要求完成所有功能。

优先完成：

1. 项目审计。
2. 首页和全局导航调整。
3. World Clock。
4. Time Zone Converter。
5. Meeting Time Planner。
6. Meeting Countdown。
7. Meeting Timer。
8. Percentage Calculator。
9. Word Counter。
10. 现有小游戏整理。
11. 收藏和最近使用。
12. 基础 SEO。
13. GA4 数据分析。

暂缓：

- 大量文件处理工具。
- 复杂团队协作。
- 用户账号体系。
- 后端和数据库。
- 全球排行榜。
- 复杂 AI 功能。
- 大规模内容生产。
- 正式广告接入。
- 多语言全面改造。

第一期的目标不是功能数量，而是验证：

**用户是否愿意把 WorkingNow 作为日常工作中随手打开的工具网站。**

---

# 九、最终产品验收标准

当第一期完成时，WorkingNow 应该具备：

1. 一个明确的全球化英文品牌首页。
2. 一个完整的 Meeting Companion 模块。
3. 一组实用的办公室小工具。
4. 一个可以正常使用的休息与小游戏模块。
5. 收藏和最近使用功能。
6. 独立的工具页面 URL。
7. 基础 SEO 能力。
8. 基础用户行为统计。
9. 稳定的 Vercel 部署。
10. 无需账号、无需安装、打开即用的产品体验。

最终衡量标准：

不是上线了多少个页面，而是用户能否在 WorkingNow 上完成真实任务，并且愿意再次回来。

**WorkingNow 的第一阶段使命：成为全球职场人工作日里的一个实用小帮手。**

---

# 十、执行状态（2026-11-16）

本计划中的代码交付范围已完成。原有审计文档见 `PROJECT_AUDIT.md`；项目入口、开发命令和兼容路由说明见仓库根目录 `README.md`。

| 阶段 | 状态 | 交付摘要 |
|---|---|---|
| Sprint 0：现状审计 | 完成 | 记录现有路由、技术栈、功能、风险和增量改造策略。 |
| Sprint 1：产品基础架构 | 完成 | 统一布局、导航、分类、工具目录、页面 metadata、版本化本地存储、收藏、最近使用、搜索和空/错误状态。 |
| Sprint 2：Meeting Companion | 完成 | 七项会议及日期工具；IANA 时区和 DST 处理；会议规划规则和浏览器本地倒计时/偏好。 |
| Sprint 3：Everyday Work Tools | 完成 | 七项工作工具，操作留在浏览器内，并提供计算、重置、复制或抽取交互。 |
| Sprint 4：Workday Break | 完成 | 四项休息功能，包含本地记录/成绩、控制和触屏交互；Relaxing Sounds 未纳入。 |
| Sprint 5：Discover | 完成 | 四个静态内容体验、原创文案、来源说明、UTC 每日题目和分享链接。 |
| Sprint 6：留存体验 | 完成 | 首页分类入口、搜索、收藏、最近使用、主题和游戏本地记录；无需账户或服务端。 |
| Sprint 7：SEO 与全球化 | 代码完成 | 页面 metadata、canonical、Open Graph、结构化数据、robots、sitemap、内部链接和 SEO 检查表。 |
| Sprint 8：数据分析 | 代码完成 | 同意控制的 Vercel Analytics 和白名单自定义事件；事件不包含用户输入。 |
| Sprint 9：商业化准备 | 代码完成 | 广告位配置和默认关闭的占位开关；About、Privacy、Terms 页面。没有接入广告网络。 |

最终集成验证：`npm run lint`、`npx tsc --noEmit --incremental false`、`npm run build` 以及四组 Node 测试均通过。生产构建成功生成 `robots.txt`、`sitemap.xml` 和新产品静态页面。

以下属于代码库外的发布/运营工作，不能由本地实现或构建验证替代：

- 在 Vercel 配置并验证 Preview/Production 域名和实际部署。
- 由站点所有者验证 Google Search Console、索引状态及生产 Core Web Vitals。
- 若决定使用 GA4，创建并配置相应账号/属性；当前实现使用同意控制的 Vercel Analytics。
- 发布隐私政策前提供真实有效的联系渠道。
- 上线广告前选择供应商并完成其同意、隐私和地区法规要求；当前广告仅为关闭状态的占位。