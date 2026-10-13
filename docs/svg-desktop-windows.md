# Tavotto SVG Windows 桌面版

本个人版基于 Tavotto v0.15.0 和本仓库 `svg-export` 分支的
`7167255823aa3a4abef2e16daa3febbfdac16e4c`，保留上游作者署名与 AGPL-3.0-only。
原图和画布的 SVG 导出已经在该提交实现，本次补充 Windows 桌面构建、打包后 SVG
验证和下载入口。它不是官方 v0.18.0，也未把旧渲染模块覆盖到新版接口。

## 下载与使用

构建成功后，在本仓库 Releases 下载 `Tavotto-0.15.0-SVG-Windows-Setup.exe`，
同时取得 `SHA256SUMS.txt` 核验。也可以在 `SVG Windows desktop` 工作流中下载
`Tavotto-SVG-Windows` 产物。没有成功构建与检查的安装包不会进入发布步骤。

已有桌面安装需要直接替换程序文件时，可下载同次构建的
`Tavotto-0.15.0-SVG-Windows-Portable.zip`。其中包含 `Tavotto.exe`、`sidecar/` 和
许可证。退出应用并备份原安装目录后，替换程序与 sidecar；原快捷方式可继续使用，
不必重新运行安装器。该方式不更新系统卸载记录中的版本号；首次启动仍可能写入
桌面壳和应用的用户数据目录，不能把解压替换称为完全免写用户目录。

打开项目，进入导出对话框，选择原图或画布范围并勾选 SVG。SVG 保留物理尺寸与
矢量路径，文字转路径以固定字体外观，位图仍为嵌入图像，不会自动矢量化。

此版本使用 v0.15.0 的安装器，默认位置是用户的 LocalAppData，目录选择页隐藏。
要安装到 D 盘，可在确认系统影响后使用 PowerShell 启动安装器，并把安装目标作为
最后一个参数，例如：`& .\Tavotto-0.15.0-SVG-Windows-Setup.exe /D=D:\Tools\Tavotto`。
不要直接覆盖正在使用的官方新版；先退出并备份已有项目与用户配置。安装器还会
创建快捷方式和卸载记录，桌面壳配置、WebView2 数据及应用数据也可能写入用户目录；
将安装位置设为 D 盘不等于零 C 盘写入。

此个人构建没有 Authenticode 签名，Windows 可能显示 SmartScreen 提示。
个人包的桌面更新地址指向本 Fork，避免更新回不含定制功能的官方包。当前不提供
签名自动更新清单，请通过 Releases 手动取得经验证的新包。

## 构建与验证

`svg-desktop-windows` 分支推送后自动运行 `.github/workflows/svg-windows.yml`。
它复用上游构建脚本，生成真实 Tauri 窗口、PyInstaller sidecar、Rust workerd 和
内置科学 Python 环境。`tauri.svg.conf.json` 只更改个人分发的更新地址与签名产物设置。

构建依次检查 SVG 导出请求和原图/画布产物、桌面认证与退出、内置环境实际渲染、
PDF/PNG/SVG 导出。检查 SVG 的命名空间、pt 物理尺寸和矢量路径，并保留旧分支的
原生像素嵌入回归用例。运行日志和 `SOURCE_COMMIT.txt` 标明精确源码版本。

自动化检查不等于已完成用户电脑上的安装和手工交互验收。
