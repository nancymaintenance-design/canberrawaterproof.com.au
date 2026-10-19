# Canberra Waterproof 后续维护约定

## llms.txt 精选中英入口（2026-10-20）

- 精选来源为 `data/llms-curation.json`，复用现有 Owner、生产域名和双语正文；由 `npm run generate` 生成 `llms.txt`，`npm run check` 检查过期、证据和语言配对。不要手工维护第二套 llms 生成结果。
- 正文变化时同步复核中英摘要及 evidence；不加入草稿、后台、noindex 或未证实事实。不因 llms 维护改变 URL/canonical、robots/WAF、训练政策或 UI。
- 维护与验证步骤见 `docs/llms-curation.md`；内部来源、脚本、报告不作为公开接口发布。llms.txt 不保证收录、排名或 AI 推荐。

先遵守 `E:/Ellis-Services/AGENTS.md` 与 `00-总览.md`，唯一工作副本为本站 source。保留他人未提交成果，部署须取得当次授权。

## 2026-10-19 本地内容后台

- 用户指定 Canberra Roof Kind 后台的三栏交互结构，要求每段文字可修改。后台源码独立在 `.local-tools/`，桌面入口“Canberra Waterproof 本地后台”；仅绑定 127.0.0.1，默认4220、冲突自动顺延。
- 后台保存只写 `.local-editor/drafts/`，不得删除或覆盖用户草稿。每页基线哈希和修订控制冲突，恢复会产生新修订。`.local-tools/` 和 `.local-editor/` 不进入生产包；不要把本地后台当作公开网站页面。
- 完整正文含内链作为一段编辑；标题、FAQ、图注、页眉页脚、图片alt和SEO可记录草稿。中文修改必须标记英文待同步，不自动翻译或部署。
- 助手先用 `node .local-tools/export-changes.mjs` 读取精确修订及基线，再把审核内容同步到英文HTML/生成器数据所有者及最高优先级中文译文，核对结构化数据和全站共用文案。源码变化引起 stale 时须合并，不得丢弃草稿。不要单独编辑生成的zh页面。
- 电话/邮箱文字修改不代表链接目标已变更；应用业务资料前核对全站一致性。后台不改变API或线上收件配置。更多操作见 `docs/local-editor.md`。

## 中英双语同步

### JSON-LD / Feed v2（2026-10-19，仅本地接入）

- 完整站点维护入口仍为 `npm run generate`（即 `node scripts/apply-seo-maintenance.mjs`）；校验用 `npm run check`，回归用 `npm test`。首次克隆需 `npm ci --ignore-scripts` 安装锁定的作者工具依赖，静态网页不依赖在线解析或翻译。
- 生成顺序：英文内容与人工译文 → 双语页面 → 从每种语言实际正文提取内容记录 → 单套 JSON-LD、RSS、JSON Feed → 双语最终文件哈希。不要将派生的全文、关键词数组整段放入翻译词典，不要直接改生成的中文 HTML。
- `.schema-feed-v2/base-schemas.json` 保留原始 Schema 及历史标识，是人工 Schema 的维护入口；页面中的 JSON-LD 是派生输出。若直接修改派生 Schema，生成器会拒绝覆盖并要求审核。不要删除此目录，否则会丢失原始图谱及草稿兼容基线。
- `.schema-feed-v2/content-record.json` 是从实际页面提取的内部记录，不是 Schema 或公开 Feed；`.schema-feed-v2/editor-baselines.json` 只用于机器数据更新兼容。以上文件纳入源码维护，但被 `.vercelignore` 排除，不可作为公开接口发布。
- 全文 Feed 仅 `/feed.json`、`/feed.xml`、`/zh/feed.json`、`/zh/feed.xml`，每种语言现有6篇指南+3篇新闻；保留各格式历史 ID/GUID，未知旧条目必须先建立迁移映射，不能静默删除。无真实完整时间不增加 Atom，不把构建时间写成内容日期。
- 标题、摘要、正文、主题词来自实际本地化页面；作者必须匹配可见署名。不得加入不可见承诺、虚构资质、评分、价格或“AI优先推荐”字段。原有专用 guide `application/json` 保持原语义，不冒充标准 Feed。
- 后台草稿及历史原文件不因 Schema 更新而改写；仅机器标记更新继续兼容旧基线，正文/元信息变化仍触发冲突，必须人工合并。保存后台草稿不等于已同步英文、已应用源码或已部署。
- `npm run check` 无写入，覆盖双语 HTML、最终 manifest、4份 Feed、基础图谱和内部记录的过期检查。交付前执行完整生成两次确认无差异，并保留本轮验证报告。任何部署仍需当次用户明确批准。

- 英文原路径和简体中文 `/zh/` 页面是对应版本；导航“联系我们”后保留“中文服务”，中文页同位置保留 English 返回当前对应英文页。
- 后续页面、标题、正文、案例说明、FAQ、表单消息、图片 alt、SEO 描述及结构化数据的修改必须同步中英文。英文 HTML 是内容源，初译缓存维护在 `data/i18n/zh-Hans.json`，常用词和人工修订放 `zh-Hans-overrides.json` 与优先级最高的 `zh-Hans-editorial.mjs`；不得单独编辑生成的 `zh/` 页面。
- 修改英文后维护对应译文，执行 `node scripts/apply-seo-maintenance.mjs` 生成双语，再运行 `node scripts/bilingual-site.mjs --check` 和 `node --test tests/bilingual-site.test.mjs`。缺译或生成页过期必须修复后交付；不得用英文静默兜底。
- 公共英文初译可通过 `node scripts/bilingual-site.mjs --translate` 更新缓存，必须复核中文术语、数字和语义。此命令只用于作者维护，访客页面无在线翻译依赖；无需该命令即可离线重建已有译文。不得把客户提交内容或秘密交给翻译服务。
- 共享照片与电话目标保持本站原业务资料：`0482 422 607` / `tel:+61482422607`；邮箱与 API/Resend 配置保持既有行为。中文表单只新增受限语言标记并发送中文确认文案，不改变收件人。
- 保留案例真实性和服务边界；中文统一使用“重新填缝”“重新密封”“防水层”等行业表达，不误译为“重新布线”。
