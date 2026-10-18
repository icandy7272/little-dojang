# B 站分段循环播放调研

调研日期：2026-10-18。目标：手机浏览器打开小小道馆后，直接播放 B 站视频，在指定片段结束时自动回到片段开头；无需安装扩展，无需下载或镜像视频。

## 结论

目前没有找到满足上述条件、可直接接入的可靠开源控制方案。现有 B 站外链播放器支持从指定时间开始，但本次检查的公开参数、当前主脚本和嵌入模块中，没有发现可供外站使用的播放进度通知或播放控制消息接口。此结论限定于本次检查，不能推断未来版本或所有内部接口均不支持。

读取不到实际播放时间时，按片段时长定时刷新 iframe 不能保证分段循环：缓冲、暂停和倍速都会导致截断错误。因此未将这种实现作为默认循环上线。

## 检查的实现

- [B 站官方外链播放器说明](https://player.bilibili.com/)：包含 t、autoplay、muted 等参数，没有文档化的结束时间、A–B 循环或消息控制接口。
- [当前外链页面](https://player.bilibili.com/player.html?bvid=BV1u2421M7EE)：页面解析的参数表同上，调用 nano.createPlayer(config)。页面中的 window.player 属于 B 站域名，外站无法直接读取其方法。
- [当前主脚本](https://s1.hdslb.com/bfs/static/player/main/core.6dcbfdb4.js)：检查 postMessage、message 监听、parent 引用和嵌入模块加载入口。找到的消息主要用于 worker、音频处理和兼容库，未找到外站的时间/控制协议。
- [当前 embedded-helper 模块](https://s1.hdslb.com/bfs/static/player/main/widgets/npd.embedded-helper.61f29de2.js)：检查 postMessage、seek、timeupdate、origin 等，没有发现跨域控制桥接。脚本文件名带版本哈希，未来可能变化。
- [EdwinZhanCN/bilibili-iframe-player](https://github.com/EdwinZhanCN/bilibili-iframe-player)：读取 index.html，实际只是生成官方 iframe，没有进度读取或片段结束控制。
- [coslyk/moonplayer](https://github.com/coslyk/moonplayer)：可播放网络视频，但采用 Qt、libmpv 等桌面组件，不能作为现有手机网页的播放器控制 SDK。
- [HimekoX/bilibili-player](https://github.com/HimekoX/bilibili-player)：README 展示的是普通媒体 URL 和另外提供的解析接口，并非对 B 站官方 iframe 的控制；README 同时说明项目为私有，不适合作为可靠依赖。

## 可行方向与适用范围

1. 保留官方 B 站 iframe：无需额外安装，视频由 B 站提供。目前可按起点打开、点击重新播放，结束位置仍需家长操作。
2. 浏览器扩展或用户脚本：脚本在 B 站播放器页面内读取 video.currentTime，并在片段终点跳回起点，技术上可实现精确循环。需要用户安装和授权，手机浏览器支持不一致，不适合作为朋友打开即用的默认方案。本次没有开发或验证扩展。
3. 自有或获准使用的直接视频源：使用网站的原生 video 播放器即可按照实际播放时间循环，同时支持暂停、倍速和缓冲。这是现有产品实现可靠默认循环的合适方向，后续可采用自行拍摄的四段示范。
4. 解析 B 站媒体地址后换播放器：属于新的媒体获取/播放架构，需要验证跨域请求、请求来源限制、地址有效期、访问权限和服务端流量；更换 DPlayer、Artplayer 或其他 UI 本身不能解决这些问题。本次未接入解析服务、未代理或保存 B 站媒体，也未验证此路线可用于生产。

## 验证边界

本次完成公开文档、GitHub 源码和 B 站实际发布脚本的静态检查；没有完成新的浏览器消息抓取试验，也没有证明所有潜在协议不存在。没有为 B 站新增循环功能或部署更改。已有原生视频和 YouTube 的循环机制不代表 B 站已具备同样能力。
