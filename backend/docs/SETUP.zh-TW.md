# 專案設定與本地開發

[English](./SETUP.md) | **繁體中文**

後端是一個 NestJS 服務，提供：

- REST API 於 `/api/*`
- Swagger UI 於 `/api/docs`
- Socket.IO 命名空間於 `/events`

---

## 前置需求

- Node.js 18+ (建議 LTS)
- npm 9+
- MongoDB 實例 (本地或 Atlas)

建議：

- `mongosh` 用於資料庫診斷
- Postman/Insomnia 用於 API 測試

---

## 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 建立環境變數檔案
macOS/Linux：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

### 3. 填寫必要變數
最少需要：

- `MONGO_URI`
- `JWT_ACCESS_SECRET` (最少 32 字元)
- `JWT_REFRESH_SECRET` (最少 32 字元)

### 4. 啟動開發伺服器
```bash
npm run start:dev
```

預設 URL：`http://localhost:4000`

Swagger：`http://localhost:4000/api/docs`

---

## 環境變數

變數在啟動時由 Joi 驗證 (`src/config/env.validation.ts`)。
無效或缺少必要值會提早停止程序。

| 變數 | 必要 | 預設 | 注意事項 |
|---|---|---|------|
| `NODE_ENV` | 否 | `development` | `development`、`production`、`test` |
| `PORT` | 否 | `4000` | HTTP 監聽埠號 |
| `MONGO_URI` | 是 | - | MongoDB 連線 URI |
| `FRONTEND_URL` | 否 | `http://localhost:4200` | CORS origin 來源；應用程式也包含 `http://localhost:4200` 降級 |
| `JWT_ACCESS_SECRET` | 是 | - | Access token secret，最少 32 字元 |
| `JWT_REFRESH_SECRET` | 是 | - | Refresh token secret，最少 32 字元 |
| `JWT_ACCESS_EXPIRES_IN` | 否 | `24h` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | 否 | `30d` | Refresh token TTL |
| `SUPERADMIN_USERNAME` | 否 | `Charmy` | 種子 superadmin 使用者名稱 |
| `SUPERADMIN_PASSWORD` | 否 | `Charmying` | 種子 superadmin 密碼 |
| `RESET_SUPERADMIN` | 否 | `false` | 如果為 true，在啟動時重置現有 superadmin 憑證 |

---

## 腳本

| 腳本 | 目的 |
|---|------|
| `npm run start` | 正常啟動應用程式 |
| `npm run start:dev` | 以檔案監看器啟動 |
| `npm run start:debug` | 以偵錯器 + 監看器啟動 |
| `npm run build` | 編譯至 `dist` |
| `npm run start:prod` | 執行生產建置 |
| `npm run seed` | 僅執行種子程序 |
| `npm run lint` | ESLint 自動修復 |
| `npm run format` | Prettier 格式化 |
| `npm test` | 單元測試 |
| `npm run test:watch` | 監看模式的單元測試 |
| `npm run test:cov` | 含覆蓋率的單元測試 |
| `npm run test:e2e` | 端對端測試 |

---

## 生產啟動序列

```bash
npm run build
npm run start:prod
```

生產檢查清單：

1. `NODE_ENV=production`
2. 配置強 JWT secrets
3. `MONGO_URI` 指向生產叢集
4. `FRONTEND_URL` 設定為生產前端 origin(s)

---

## 疑難排解

### 埠號已被使用
在 `.env` 中設定另一個埠號：

```env
PORT=4001
```

### MongoDB 連線失敗
```bash
mongosh "mongodb://localhost:27017/restaurant-ordering"
```

### 環境變數驗證失敗
檢查啟動日誌並與 `src/config/env.validation.ts` 比較變數。

### 清除重新安裝
macOS/Linux：

```bash
rm -rf node_modules package-lock.json dist
npm install
```

Windows PowerShell：

```powershell
Remove-Item -Recurse -Force node_modules, dist
Remove-Item -Force package-lock.json
npm install
```
