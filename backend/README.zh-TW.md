# 後端

[English](./README.md) | **繁體中文**

餐廳點餐系統的企業級 NestJS 後端。生產就緒的 API 伺服器，提供完整的 REST 端點、即時 WebSocket 通訊與強健的認證機制。

---

## 🚀 快速開始

```bash
npm install
cp .env.example .env
# 在 .env 中配置你的 MongoDB URI 和 JWT secrets
npm run start
# API 運行於 http://localhost:4000
```

---

## 🏗️ 架構概覽

### 現代 NestJS 模式
- **模組化架構** — 領域驅動的模組組織
- **依賴注入** — 簡潔、可測試的服務架構
- **裝飾器與元資料** — 宣告式程式設計模型
- **型別安全** — 全面的強型別 TypeScript

### 架構原則
- **領域導向模組** — 依領域組織業務邏輯
- **精簡控制器** — 控制器處理 HTTP，服務處理業務邏輯
- **集中式策略** — 共用模組處理跨領域關注點
- **明確驗證** — 所有輸入使用 DTO 驗證
- **標準化回應** — 一致的 API 回應封裝

---

## 🛠️ 技術堆疊

### 核心框架
- **NestJS 11** — 漸進式 Node.js 框架與 TypeScript
- **Express 平台** — HTTP 伺服器基礎
- **Socket.IO** — 即時 WebSocket 通訊
- **Reflect Metadata** — 裝飾器與元資料支援

### 資料庫與 ORM
- **MongoDB** — NoSQL 文件資料庫
- **Mongoose** — 優雅的 MongoDB 物件建模
- **TypeScript 整合** — 資料庫操作的強型別

### 認證與安全
- **JWT (JSON Web Tokens)** — 無狀態認證
- **Passport.js** — 認證中介軟體
- **bcryptjs** — 安全密碼雜湊
- **Helmet** — 安全標頭中介軟體
- **class-validator** — 輸入驗證與清理

### API 文件
- **Swagger/OpenAPI** — 互動式 API 文件
- **@nestjs/swagger** — 自動 OpenAPI 生成
- **TypeScript 裝飾器** — 豐富的 API 元資料

---

## 📁 專案結構

```text
backend/
├── docs/                                 # 後端文件
│   ├── README.zh-TW.md                   # 文件索引
│   ├── API.zh-TW.md                      # REST API 文件
│   ├── ARCHITECTURE.zh-TW.md             # 架構模式
│   ├── AUTH.zh-TW.md                     # 認證與授權
│   ├── DATABASE.zh-TW.md                 # 資料庫架構
│   ├── DEPENDENCIES.zh-TW.md             # 套件依賴
│   ├── OPERATIONS.zh-TW.md               # 部署與維運
│   ├── SETUP.zh-TW.md                    # 開發設定
│   ├── SEED.zh-TW.md                     # 資料庫種子
│   └── WEBSOCKET.zh-TW.md                # 即時事件
├── src/                                  # 應用程式原始碼
│   ├── common/                           # 跨領域關注點
│   │   ├── decorators/                   # 自訂裝飾器
│   │   ├── filters/                      # 例外過濾器
│   │   ├── guards/                       # 認證守衛
│   │   ├── interceptors/                 # 請求/回應攔截器
│   │   ├── middlewares/                  # 自訂中介軟體
│   │   ├── pipes/                        # 資料轉換管道
│   │   └── utils/                        # 工具函式
│   ├── modules/                          # 業務領域模組
│   │   ├── auth/                         # 認證
│   │   ├── users/                        # 使用者管理
│   │   ├── tables/                       # 桌位管理
│   │   ├── orders/                       # 訂單處理
│   │   ├── menu/                         # 菜單與項目
│   │   ├── categories/                   # 菜單分類
│   │   ├── store/                        # 店家設定
│   │   ├── messages/                     # 訊息系統
│   │   ├── reports/                      # 分析與報表
│   │   └── websocket/                    # 即時事件
│   ├── config/                           # 配置管理
│   ├── app.module.ts                     # 根模組
│   └── main.ts                           # 應用程式入口點
├── test/                                 # 端對端測試
├── .env.example                          # 環境變數範本
├── nest-cli.json                         # NestJS CLI 配置
├── tsconfig.json                         # TypeScript 配置
├── package.json                          # 依賴套件
└── README.zh-TW.md                       # 專案說明 (中文)
```

### 模組模式
每個領域模組遵循一致的組織方式：

```text
module-name/
├── module-name.module.ts                 # 模組定義
├── module-name.controller.ts             # HTTP 請求處理器
├── module-name.service.ts                # 業務邏輯
├── module-name.dto.ts                    # 資料傳輸物件
└── module-name.schema.ts                 # 資料庫架構
```

---

## 🔌 核心 API 端點

### 認證
```bash
POST   /api/auth/login                    # 使用者認證
POST   /api/auth/register                 # 使用者註冊
POST   /api/auth/refresh                  # Token 刷新
POST   /api/auth/logout                   # 使用者登出
```

### 使用者管理
```bash
GET    /api/users                         # 列出使用者 (管理員)
GET    /api/users/:id                     # 取得使用者詳情
PUT    /api/users/:id                     # 更新使用者
DELETE /api/users/:id                     # 刪除使用者
```

### 桌位管理
```bash
GET    /api/tables                        # 列出桌位
POST   /api/tables                        # 建立桌位
GET    /api/tables/:id                    # 取得桌位詳情
PUT    /api/tables/:id                    # 更新桌位
DELETE /api/tables/:id                    # 刪除桌位
POST   /api/tables/:id/qr                 # 生成 QR Code
```

### 訂單管理
```bash
GET    /api/orders                        # 列出訂單
POST   /api/orders                        # 建立訂單
GET    /api/orders/:id                    # 取得訂單詳情
PUT    /api/orders/:id                    # 更新訂單狀態
DELETE /api/orders/:id                    # 取消訂單
GET    /api/orders/table/:tableId         # 依桌位查詢訂單
```

### 菜單管理
```bash
GET    /api/menu                          # 取得完整菜單
GET    /api/menu/categories               # 取得分類
GET    /api/menu/items                    # 取得菜單項目
POST   /api/menu/items                    # 建立菜單項目
PUT    /api/menu/items/:id                # 更新菜單項目
DELETE /api/menu/items/:id                # 刪除菜單項目
```

完整 API 文件請參閱 [API.zh-TW.md](./docs/API.zh-TW.md)

---

## 🔐 認證與安全

### 基於 JWT 的認證
- **Access Tokens**：短期 JWT token
- **Refresh Tokens**：長期 refresh token
- **Token 輪替**：自動 refresh token 輪替
- **安全儲存**：使用 HttpOnly cookies 儲存 refresh token

### 安全措施
- **密碼雜湊**：使用 bcryptjs 與 salt rounds
- **輸入驗證**：完整的 DTO 驗證
- **速率限制**：每個端點的請求節流
- **CORS 配置**：安全的跨來源請求
- **安全標頭**：Helmet 中介軟體提供安全標頭
- **SQL 注入防護**：Mongoose ODM 保護

詳細認證流程請參閱 [AUTH.zh-TW.md](./docs/AUTH.zh-TW.md)

---

## 🔄 即時通訊

### WebSocket 事件
透過 Socket.IO 的即時更新：

#### 連線事件
```typescript
// 客戶端連線
socket.emit('join-room', { tableId: 'table-123' });

// 伺服器回應
socket.on('order-updated', (order) => { /* 處理 */ });
socket.on('table-status-changed', (table) => { /* 處理 */ });
```

#### 事件類型
- **訂單事件**：訂單建立、狀態更新、完成
- **桌位事件**：桌位狀態變更、QR Code 更新
- **系統事件**：維護通知、系統警報
- **訊息事件**：員工通訊、公告

完整 WebSocket 文件請參閱 [WEBSOCKET.zh-TW.md](./docs/WEBSOCKET.zh-TW.md)

---

## 🗄️ 資料庫設計

### MongoDB 集合
```typescript
// 使用者集合
interface User {
  _id: ObjectId;
  email: string;
  password: string; // bcrypt 雜湊
  role: UserRole;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

// 桌位集合
interface Table {
  _id: ObjectId;
  number: string;
  capacity: number;
  status: TableStatus;
  qrCode: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 訂單集合
interface Order {
  _id: ObjectId;
  tableId: ObjectId;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 菜單項目集合
interface MenuItem {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  category: ObjectId;
  available: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

完整資料庫架構請參閱 [DATABASE.zh-TW.md](./docs/DATABASE.zh-TW.md)

---

## 🔧 開發工作流程

```bash
# 安裝依賴套件
npm install

# 啟動開發伺服器
npm run start

# 啟動監看模式
npm run start:dev

# 建置生產版本
npm run build

# 執行測試
npm test

# 執行端對端測試
npm run test:e2e

# 程式碼檢查
npm run lint
```

---

## 📚 相關文件

### 後端文件
- [**API 文件**](./docs/API.zh-TW.md) — 完整 REST API 參考
- [**認證**](./docs/AUTH.zh-TW.md) — 安全與授權細節
- [**資料庫架構**](./docs/DATABASE.zh-TW.md) — 資料模型與關聯
- [**WebSocket 事件**](./docs/WEBSOCKET.zh-TW.md) — 即時事件規格
- [**設定指南**](./docs/SETUP.zh-TW.md) — 開發環境設定
- [**依賴套件**](./docs/DEPENDENCIES.zh-TW.md) — 套件依賴與使用方式
- [**維運**](./docs/OPERATIONS.zh-TW.md) — 部署與維護
- [**架構**](./docs/ARCHITECTURE.zh-TW.md) — 系統設計模式

### 系統文件
- [**系統架構**](../docs/README.zh-TW.md) — 高階系統設計
- [**色彩系統**](../docs/color-system.zh-TW.md) — 設計 token 與主題
- [**i18n 慣例**](../docs/architecture/i18n-naming.zh-TW.md) — 翻譯標準
- [**頁面功能說明**](../docs/page-function-description/page-function-description.zh-TW.md) — 各頁面功能簡介

### 前端文件
- [**前端架構**](../frontend/README.zh-TW.md) — Angular 客戶端架構
- [**前端設定**](../frontend/docs/SETUP.zh-TW.md) — 前端開發設定
