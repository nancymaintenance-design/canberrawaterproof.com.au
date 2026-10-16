# Canberra Waterproof 后续维护约定

先遵守 `E:/Ellis-Services/AGENTS.md` 与 `00-总览.md`，唯一工作副本为本站 source。保留他人未提交成果，部署须取得当次授权。

## 中英双语同步

- 英文原路径和简体中文 `/zh/` 页面是对应版本；导航“联系我们”后保留“中文服务”，中文页同位置保留 English 返回当前对应英文页。
- 后续页面、标题、正文、案例说明、FAQ、表单消息、图片 alt、SEO 描述及结构化数据的修改必须同步中英文。英文 HTML 是内容源，初译缓存维护在 `data/i18n/zh-Hans.json`，常用词和人工修订放 `zh-Hans-overrides.json` 与优先级最高的 `zh-Hans-editorial.mjs`；不得单独编辑生成的 `zh/` 页面。
- 修改英文后维护对应译文，执行 `node scripts/apply-seo-maintenance.mjs` 生成双语，再运行 `node scripts/bilingual-site.mjs --check` 和 `node --test tests/bilingual-site.test.mjs`。缺译或生成页过期必须修复后交付；不得用英文静默兜底。
- 公共英文初译可通过 `node scripts/bilingual-site.mjs --translate` 更新缓存，必须复核中文术语、数字和语义。此命令只用于作者维护，访客页面无在线翻译依赖；无需该命令即可离线重建已有译文。不得把客户提交内容或秘密交给翻译服务。
- 共享照片与电话目标保持本站原业务资料：`0482 422 607` / `tel:+61482422607`；邮箱与 API/Resend 配置保持既有行为。中文表单只新增受限语言标记并发送中文确认文案，不改变收件人。
- 保留案例真实性和服务边界；中文统一使用“重新填缝”“重新密封”“防水层”等行业表达，不误译为“重新布线”。
