# 餐廳點餐系統

[English](./README.md) | **繁體中文**

一個採用企業級架構打造的生產就緒餐廳管理與點餐系統。本系統透過 QR Code 提供無縫的顧客點餐體驗，同時為餐廳營運提供全面的管理功能。

---

## 🎯 這是什麼？

一個全端餐廳點餐平台，連結顧客便利性與營運卓越性。顧客掃描 QR Code 即可點餐，員工則透過完整的儀表板管理所有事務。

---

## ⚡ 快速開始

### 前置需求
- Node.js v18+
- npm v10+
- MongoDB (本地或雲端)

### 三步驟啟動

```bash
# 1. 複製專案
git clone https://github.com/Charmying/restaurant-ordering-system
cd restaurant-ordering-system

# 2. 啟動後端
cd backend
npm install
cp .env.example .env
# 編輯 .env 填入你的 MongoDB URI 和 JWT secrets
npm run start
# API 運行於 http://localhost:4000

# 3. 啟動前端 (開新終端機)
cd frontend
npm install
npm run start
# 應用程式運行於 http://localhost:4200
```

---

## 🌟 核心功能

- **📱 QR Code 點餐** — 顧客掃描桌號 QR Code 瀏覽菜單並下單
- **🎛️ 管理儀表板** — 完整管理桌位、訂單、菜單、分類、店家設定、分析報表與使用者
- **🌍 多語言支援** — 英文與繁體中文，支援內容即時編輯
- **🎨 明暗主題** — 精緻的主題系統，採用語意化設計 token
- **⚡ 即時更新** — WebSocket 驅動的即時訂單與狀態更新
- **🔒 安全認證** — 基於 JWT 的認證與角色權限控制

---

## 🛠️ 技術堆疊

### 前端
- Angular 21 (獨立元件、signals)
- Tailwind CSS v4
- @ngx-translate/core
- Socket.IO client

### 後端
- NestJS 11
- MongoDB + Mongoose
- JWT + Passport.js
- Socket.IO
- Swagger/OpenAPI

---

## 📚 文件

### 🚀 入門指南
- [前端設定](./frontend/docs/SETUP.zh-TW.md) — 前端開發環境
- [後端設定](./backend/docs/SETUP.zh-TW.md) — 後端開發環境

### 🏗️ 架構
- [系統架構](./docs/README.zh-TW.md) — 高階系統設計
- [前端架構](./frontend/README.zh-TW.md) — Angular 結構與模式
- [後端架構](./backend/README.zh-TW.md) — NestJS 結構與模式

### 📖 開發指南
- [色彩系統](./docs/color-system.zh-TW.md) — 設計 token 與主題
- [i18n 慣例](./docs/architecture/i18n-naming.zh-TW.md) — 翻譯鍵命名模式
- [API 文件](./backend/docs/API.zh-TW.md) — REST API 參考
- [WebSocket 事件](./backend/docs/WEBSOCKET.zh-TW.md) — 即時事件規格

### 🔐 安全與維運
- [認證指南](./backend/docs/AUTH.zh-TW.md) — 安全模型與授權
- [資料庫架構](./backend/docs/DATABASE.zh-TW.md) — 資料模型與關聯
- [維運指南](./backend/docs/OPERATIONS.zh-TW.md) — 部署與維護

---

## 📁 專案結構

```text
restaurant-ordering-system/
├── backend/                     # NestJS API 伺服器
│   ├── src/                     # 應用程式原始碼
│   ├── docs/                    # 後端文件
│   └── README.zh-TW.md
├── frontend/                    # Angular 客戶端應用程式
│   ├── src/                     # 應用程式原始碼
│   ├── docs/                    # 前端文件
│   └── README.zh-TW.md
├── docs/                        # 系統層級文件
│   ├── architecture/            # 架構決策
│   └── README.zh-TW.md
├── CHANGELOG.zh-TW.md           # 版本歷史
├── LICENSE                      # 授權資訊
└── README.zh-TW.md              # 專案說明 (中文)
```
