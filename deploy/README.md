# 腾讯云部署

这个项目是静态网站，不需要数据库和应用服务器。先执行 `npm test` 与 `npm run build`，仅发布 `dist/`。不要将整个仓库目录作为网站根目录。

## 已有腾讯云 CVM / 轻量服务器

1. 将 `dist/` 上传到独立目录，例如 `/var/www/little-dojang/releases/<版本>/`。
2. 使用 `current` 符号链接指向该版本，便于回滚。
3. 新增独立域名的 Nginx 配置，或在现有 HTTPS 站点内增加 `/taekwondo/` 路径。示例见 `nginx.conf.example`。
4. 确保 `.mjs` 的响应类型为 `application/javascript`，否则浏览器会拒绝加载。
5. 先运行 `nginx -t`，通过后 reload。为独立域名配置 DNS 与 HTTPS。
6. 检查首页、JS/CSS 资源、官方视频嵌入、练习记录与窄屏布局。

应用使用相对路径，可以部署到子路径。`Referrer-Policy` 不应设成 `no-referrer`，以免 YouTube 拒绝嵌入。

## 腾讯云 CloudBase 静态托管

在已开通静态托管的 CloudBase 环境中，可通过控制台上传 `dist/` 内容，也可以使用官方 CLI：

```sh
npm install -g @cloudbase/cli
tcb login
tcb hosting deploy dist/ -e YOUR_ENV_ID
```

`YOUR_ENV_ID` 由环境所有者提供，不将密钥写入仓库。命令会覆盖目标中同名文件，请使用本项目专用环境或独立路径。

官方资料：https://docs.cloudbase.net/hosting/quick-start

## 使用限制

网站部署到腾讯云后，官方示范仍来自 YouTube；腾讯云托管不会改变视频平台的网络可达性。无法访问时，使用本地教学视频。项目不下载或转存第三方视频。
