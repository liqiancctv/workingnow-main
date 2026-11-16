# SEO 页面质量检查表

在公开页面加入 sitemap 前逐项检查：

- [ ] 页面提供已实现、可实际使用的功能或有独立价值的内容。
- [ ] 页面有独立、准确的 title 和 description，不堆叠关键词。
- [ ] Canonical 指向当前首选 URL；无 locale、参数或重定向循环。
- [ ] Open Graph title/description 与可见页面内容一致。
- [ ] 首屏说明工具用途；下方说明输入、输出、规则或操作方法。
- [ ] 相关页面有真实内部链接，面包屑 URL 可访问。
- [ ] 结构化数据与可见信息一致，不填入虚假评分或评价。
- [ ] 页面在窄屏可操作；无横向溢出遮挡主要输入和结果。
- [ ] robots 允许必要页面抓取，sitemap 不包含未完成或 noindex 页面。
- [ ] 旧 URL 的状态码和跳转经核验，不将不相关内容重定向到首页。
- [ ] 用户文本/会议数据不会出现在 metadata、链接、analytics 或 URL 参数中。
- [ ] Search Console 索引与 Core Web Vitals 状态由站点所有者在生产环境确认。

本仓库目前包含 Google site verification HTML 文件；这只能证明验证文件已放入静态资源，不能证明 Search Console 账号已验证或已检查索引状态。
