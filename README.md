# mk-fe-wl-web

最小 Cloudflare Workers + D1 网站。首页由 Workers Static Assets 提供，使用原生 HTML、CSS 和 JavaScript。浏览器通过同源 `GET /api/hello` 查询 D1 中 `demo` 表的 `id = 1` 记录。

## 本地开发

使用 Node.js 22 LTS（至少 22.12）或 Node.js 24 LTS。在仓库根目录执行：

```sh
npm install
npx wrangler d1 execute DB --local --file=./schema.sql
npm run dev
```

打开 `http://localhost:8787` 查看首页，或用 `curl -i http://localhost:8787/api/hello` 查看 API。`--local` 使用本地 D1，初始化数据保存在 `.wrangler/` 中，无需登录 Cloudflare。同一份 `schema.sql` 可以重复执行，已有的 `id = 1` 记录会保留。

| 场景 | API 响应 |
| --- | --- |
| 找到记录 | `200`，返回 D1 中的 `id` 和 `message` |
| 表存在，但没有 `id = 1` | `404`，返回错误信息 |
| 表不存在或数据库查询异常 | `500`，返回错误信息 |

API 失败时，首页会显示“查询失败”。

## 部署（仅在准备上线时手动执行）

`wrangler.jsonc` 将 `DB` 绑定到已有的 `mk-fe-wl-db`。部署前，请确认目标账号可使用该数据库，并且数据库已有 `demo` 表和 `id = 1` 的记录。部署命令不会初始化或写入 D1；`schema.sql` 上面的执行步骤仅用于本地开发。

```sh
npx wrangler login
npm run deploy
```
