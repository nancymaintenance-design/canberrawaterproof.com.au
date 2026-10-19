# 双语 JSON-LD / Feed v2 维护

本轮只在本地接入。原设计、正文、图片、表单和联系方式不变；不自动发布。

## 日常操作

1. 英文 HTML 或其负责的内容生成器数据改稿；补齐 `data/i18n/zh-Hans-overrides.json` 或最高优先级 `zh-Hans-editorial.mjs` 的人工译文。
2. 首次安装作者工具：`npm ci --ignore-scripts`。
3. 执行 `npm run generate`。中文页、Schema 和4份 Feed 一并生成，缺译报错而不以英文兜底。
4. 再执行 `npm run generate`（应无变更）、`npm run check`、`npm test`。核对中英文页面及报告，再单独申请部署。

仅本次机器信息的变更不会影响后台已保存草稿的基线。正文有实质修改时仍需要审核与合并，不能绕过 stale 保护。

## 数据归属

- 英文可见 HTML / 内容生成器 + 人工译文：最终可见内容的来源。
- `.schema-feed-v2/base-schemas.json`：原始图谱。按页面文件键维护真实公司/页面/服务信息，保留历史 `@id`，不要直接改 HTML 中派生 JSON-LD。
- `scripts/schema-feed-core.mjs`：已审核方案的提取、图谱和全文 Feed 规则。
- `scripts/schema-feed-site.mjs`：原始图谱与派生结果的隔离、历史 Feed 标识、草稿基线兼容、最终输出计划。
- `.schema-feed-v2/content-record.json`：每次生成后从双语页面提取的完整内部记录。不是公开协议，不可整份嵌入网页。
- `data/i18n/manifest.json`：记录最终双语 HTML 的哈希，包含最终 Schema，而不是生成中间态。

所有内部脚本、记录、后台和文档通过 `.vercelignore` 排除。后台草稿继续保存在 `.local-editor/drafts/`，本工具不改写任何草稿或历史文件。

## 发布路径与身份

文章栏目共有6篇指南、3篇新闻，各语言9条全文。英文 `/feed.json` / `/feed.xml`；中文 `/zh/feed.json` / `/zh/feed.xml`。JSON Feed 为1.1，RSS为2.0及content/DC扩展。新增头部发现链接不改变视觉界面。

Feed 生成先读取现有文件，分别沿用 JSON 的 `id` 与 RSS 的 `guid`。发现无法匹配的旧条目立即停止，需人工核对迁址映射、保留ID并配置重定向后才能继续。不得通过清空 Feed 来绕过错误。

日期保留已有真实 Schema 值；日期只有年月日时不凭空补时区或午夜，Feed可选时间省略。没有真实完整时间，不生成或声明 Atom；已有 Atom 时必须显式迁入其真实时间/身份，生成器会停止而不删除。

没有可见署名的新闻不虚构作者；指南保留可见 MEL ONE 机构署名。主题词只取本页可见标题。FAQ 继续保留原有效语义，不承诺普通服务网站可获得 Google FAQ 富结果。

## 验证边界

本地检查只证明结构、内容对应、身份与输出一致。不能证明线上 CDN/WAF、Google 收录、九个平台检索或实际引用。实际部署后另行检查真实路由、响应类型和爬虫访问。Vercel 构建设置仍需发布前核对，本轮没有操作生产设置。
