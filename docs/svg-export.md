# SVG 导出扩展

本分支基于 [Tavotto/Tavotto](https://github.com/Tavotto/Tavotto) v0.15.0。

修改日期：2026-09-20；修改维护者：yuanyi5453-oss。保留 Tavotto 上游作者署名，本修改版继续使用 AGPL-3.0-only。

- 桌面版：导出对话框新增 SVG，支持原图和画布范围，也可与 PDF、PNG 等一起导出。
- Python 引擎：保留已有的 matplotlib SVG 直接序列化；共享桌面导出管线新增 SVG。
- Codex 插件：保留 `tavotto_export` 的 SVG 参数，内嵌画布新增「导出 SVG」按钮。

桌面 SVG 来自与 PDF 相同的页面快照。页面宽高显式使用 pt，避免阅读器把 PDF 的
点数解释为 CSS 像素而缩小物理尺寸。文字转路径以保留字体外观；曲线和形状保持
矢量，素材中的位图与既有合成过程中需要栅格化的效果仍以位图嵌入。SVG 不会将
照片自动矢量化。引擎直接导出的 SVG 仍遵循 matplotlib 的字体设置。

导出沿用同一份预检、覆盖策略、临时文件与原子发布流程。SVG 失败时，多格式任务
中已成功的格式仍可交付。SVG 本身不要求 PPI；同时选 PNG 或 TIFF 时才使用 PPI。

## 本地验证

```powershell
python -m ruff check .
python -m pytest tests/test_export_request.py tests/test_export_pipeline.py tests/test_export_endpoint.py tests/test_mcp_roundtrip.py
cd web
pnpm i18n:check
pnpm test
pnpm build
```

运行 MCP stdio 测试不能替代真实 Codex 内嵌界面的验收。
