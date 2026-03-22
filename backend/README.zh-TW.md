# 後端（伺服器應用）

[English](./README.md) | **繁體中文**

本資料夾放 HTTP 與即時服務。目前實作為 **`node-api/`**（NestJS + MongoDB）。日後可於此層級新增其他服務（例如 `java-api/`）。

---

## 文件

| 位置 | 內容 |
|------|------|
| [`docs/`](./docs/README.zh-TW.md) | **node-api** 之工程文件（API、DB、認證、WebSocket、維運等）；其他服務另建 `*/docs` 並於此或 README 連結 |
| [`node-api/README.zh-TW.md`](./node-api/README.zh-TW.md) | NestJS 套件總覽與快速開始 |

`docs/SETUP.zh-TW.md` 中的指令預設工作目錄為 **`node-api/`**（另有註明者除外）。

---

## 快速開始（Node API）

```bash
cd node-api
npm install
cp .env.example .env
# 編輯 .env
npm run start:dev
```

詳見 [`docs/SETUP.zh-TW.md`](./docs/SETUP.zh-TW.md)。
