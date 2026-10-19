# llms.txt 精选内容维护

本文件为内部维护说明，不发布。本站 llms.txt 是可选的内容入口，不是排名、收录或推荐开关。

## 内容源与生成

- `data/llms-curation.json` 只维护精选路由、中英名称、摘要、正文证据与入选原因；正式域名复用现有双语生成器，不另建品牌资料库。该内部文件被部署排除。
- 每个条目使用现有英文 Owner 路由，中文对应 `/zh/`。摘要依据各自页面正文，不根据路径猜测，不增加页面没有的承诺。
- 英文及中文正文仍按原双语流程维护；正文调整后同步更新两种语言的摘要及 evidence，后者必须能在对应正文中找到。
- 不直接手改生成的 `llms.txt`。执行 `npm run generate` 后由现有维护入口生成；请求文件时不调用模型、翻译或爬虫。
- 新增精选页面先核对真实导航、sitemap、canonical、自身及对方 hreflang、语言和 noindex；不机械导出所有路由。失效条目先查原因，不擅自修改 Owner、URL、robots、WAF 或训练政策。

## 本地检查

```powershell
npm run generate
npm run generate
npm run check
npm test
node scripts/llms-curation.mjs --serve 4233
```

第二次生成应无变更。预览仅绑定回环地址，只读服务公开 HTML/资源及 llms、robots、sitemap、既有 Feed；不会提交表单或提供后台接口。端口被占用时改用空闲端口或传 0 自动选择。

单元测试覆盖配对、正文证据、过期输出、危险/失效路由、noindex、canonical/hreflang、UTF-8 GET 与私有文件隔离。完整线上只读验证脚本及逐页结果在 `../reports/2026-10-20-llms/`。

## 发布边界

保持原有 GitHub → Vercel 发布规则；main 自动发布，未获当次许可不得推送或合并。发布后另验正式 `/llms.txt` 的 GET 正文、MIME、候选哈希及全部目标链接。测试 User-Agent 成功不证明真实机器人访问、索引或引用；这些需独立日志及平台证据。
