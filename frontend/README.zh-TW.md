# 前端

[English](./README.md) | **繁體中文**

餐廳點餐系統的 Angular 21 企業級前端。採用獨立元件、signal 狀態管理與路由驅動佈局的現代架構。

---

## 🚀 快速開始

```bash
npm install
npm start
# 應用程式運行於 http://localhost:4200
```

---

## 🏗️ 架構亮點

### 現代 Angular 模式
- **獨立元件** — 無需 NgModules，更簡潔的元件定義
- **Signal 狀態** — 使用 Angular signals 的響應式狀態管理
- **路由驅動佈局** — 透過路由組合佈局殼層
- **型別安全** — 嚴格的 TypeScript 與完整型別定義

### 架構組織
- **功能導向結構** — 每個領域有自己的組織資料夾
- **關注點分離** — UI、狀態與呈現之間的清晰界線
- **共享工具** — 純函式與可重用邏輯
- **核心元件** — 可重用的 UI 建構區塊

---

## 🛣️ 路由與佈局系統

應用程式使用巢狀路由與佈局殼層：

### 路由結構
```text
/                    → NormalLayoutComponent → HomeComponent
/order               → OrderLayoutComponent → OrderComponent  
/login               → NormalLayoutComponent → LoginComponent
/dashboard           → AdminLayoutComponent → DashboardShell
/dashboard/*         → AdminLayoutComponent → 延遲載入功能
```

### 佈局殼層
- **NormalLayout** — 標準頁面 (首頁、登入、公開內容)
- **OrderLayout** — 顧客點餐流程與專用導覽
- **AdminLayout** — 儀表板與側邊欄導覽及管理功能

---

## 📁 專案結構

```text
frontend/
├── docs/                                 # 前端文件
│   ├── DEPENDENCIES.zh-TW.md             # npm 依賴套件
│   ├── I18N.zh-TW.md                     # 國際化指南
│   └── SETUP.zh-TW.md                    # 開發設定
├── public/                               # 靜態資源
│   └── assets/
│       └── i18n/                         # 翻譯檔案 (en.json, zh.json)
├── src/
│   ├── app/
│   │   ├── core/                         # 核心基礎設施
│   │   │   ├── admin-layout/             # 管理儀表板佈局
│   │   │   ├── normal-layout/            # 標準頁面佈局
│   │   │   ├── order-layout/             # 顧客點餐佈局
│   │   │   ├── components/               # 可重用 UI 元件
│   │   │   ├── composables/              # Signal 邏輯
│   │   │   └── services/                 # 核心服務
│   │   ├── features/                     # 功能模組
│   │   │   ├── dashboard/                # 管理殼層
│   │   │   ├── home/                     # 首頁
│   │   │   ├── login/                    # 認證
│   │   │   ├── order/                    # 顧客點餐
│   │   │   ├── table-management/         # 桌位管理
│   │   │   ├── order-management/         # 訂單管理
│   │   │   ├── menu-management/          # 菜單管理
│   │   │   ├── category-management/      # 分類管理
│   │   │   ├── store-info/               # 店家設定
│   │   │   ├── message-board/            # 員工通訊
│   │   │   ├── business-reports/         # 分析報表
│   │   │   └── user-management/          # 使用者管理
│   │   ├── shared/                       # 共享工具
│   │   ├── app.config.ts                 # 應用程式配置
│   │   ├── app.routes.ts                 # 路由定義
│   │   └── app.ts                        # 根元件
│   ├── index.html                        # HTML 入口點
│   ├── main.ts                           # 啟動入口
│   └── styles.css                        # 全域樣式與設計 token
├── angular.json                          # Angular CLI 配置
├── package.json                          # 依賴套件
└── README.zh-TW.md                       # 專案說明 (中文)
```

### 功能模式
每個功能遵循一致的組織方式：

```text
feature-name/
├── feature-name.component.ts             # UI 元件邏輯
├── feature-name.component.html           # 元件模板
├── feature-name.component.scss           # 元件樣式
├── feature-name.service.ts               # 狀態管理
├── feature-name.presenter.ts             # 資料格式化
├── feature-name.types.ts                 # 型別定義
└── feature-name.mock.ts                  # 模擬資料
```

---

## 🎨 設計系統與主題

### 語意化色彩系統
在 `src/styles.css` 中定義的精緻色彩系統：

- **Surface Tokens** — 不同層級的背景色
- **Text Tokens** — 階層式文字色彩以提升可讀性
- **Interactive Tokens** — 品牌色、強調色與互動狀態
- **Status Tokens** — 成功、警告、錯誤與資訊的語意色彩

### 主題實作
- **明暗主題** — 使用語意 token 的完整主題對等
- **主題切換** — 即時主題切換與平滑過渡
- **持久化偏好** — 使用者主題選擇儲存於 localStorage
- **CSS 變數** — 主題值由 CSS 自訂屬性驅動

### 樣式架構
- **Tailwind CSS v4** — 工具優先樣式與自訂設計 token
- **元件樣式** — 元件專用的作用域 SCSS
- **全域樣式** — 設計 token 與基礎樣式於 `styles.css`
- **響應式設計** — 行動優先的響應式斷點

---

## 🌍 國際化 (i18n)

### 翻譯系統
- **@ngx-translate/core** — 基於 JSON 的翻譯系統
- **結構化鍵** — 語意化翻譯鍵組織
- **語言持久化** — 使用者語言偏好本地儲存
- **降級支援** — 優雅降級至預設語言

### 翻譯資源
```text
public/assets/i18n/
├── en.json           # 英文翻譯
└── zh.json           # 中文翻譯
```

### 鍵組織
翻譯鍵遵循結構化模式：
- `layout.*` — 跨領域 UI 結構
- `common.*` — 共享動作與訊息
- `features.*` — 領域專用功能
- `language.*` — 語言切換標籤

### 實作範例
```typescript
// 模板使用
{{ 'layout.header.title' | translate }}

// 程式化使用
this.translate.instant('features.order.item.add')
```

---

## 🔧 開發工作流程

```bash
# 安裝依賴套件
npm install

# 啟動開發伺服器
npm start

# 建置生產版本
npm run build

# 執行測試
npm test

# 程式碼檢查
npm run lint
```

---

## 📊 狀態管理

### Signal 架構
- **元件狀態** — 使用 signals 的本地元件狀態
- **服務狀態** — 服務管理的共享狀態
- **衍生狀態** — 使用 `computed()` signals 的計算值
- **效果** — 使用 `effect()` signals 的副作用

### 資料流模式
1. **元件 → 服務** — 使用者動作觸發服務方法
2. **服務 → API** — 服務處理後端通訊
3. **服務 → 元件** — Signals 更新元件狀態
4. **元件 → 視圖** — 模板響應 signal 變化

---

## 🔌 API 整合

### HTTP 通訊
- **Angular HTTP Client** — 標準 HTTP 操作
- **型別化回應** — 強型別 API 回應
- **錯誤處理** — 集中式錯誤處理與使用者回饋
- **請求攔截器** — 認證與日誌記錄

### 即時更新
- **WebSocket 整合** — 即時訂單與狀態更新
- **事件處理** — 響應式事件處理
- **連線管理** — 自動重連與錯誤恢復

---

## 🎯 效能優化

### 打包優化
- **延遲載入** — 基於路由的程式碼分割
- **Tree Shaking** — 消除未使用的程式碼
- **資源優化** — 圖片與資源優化
- **建置優化** — 生產建置優化

### 執行時效能
- **Signal 效率** — 細粒度響應式更新
- **OnPush 策略** — 優化變更偵測
- **虛擬捲動** — 高效列表渲染
- **圖片載入** — 漸進式與延遲圖片載入

---

## 📚 相關文件

### 前端文件
- [**依賴套件參考**](./docs/DEPENDENCIES.zh-TW.md) — npm 套件與使用方式
- [**i18n 實作**](./docs/I18N.zh-TW.md) — 翻譯系統細節
- [**設定指南**](./docs/SETUP.zh-TW.md) — 開發環境設定

### 系統文件
- [**架構概覽**](../docs/README.zh-TW.md) — 系統層級架構
- [**色彩系統**](../docs/color-system.zh-TW.md) — 設計 token 與主題
- [**i18n 慣例**](../docs/architecture/i18n-naming.zh-TW.md) — 翻譯標準
- [**頁面功能說明**](../docs/page-function-description/page-function-description.zh-TW.md) — 各頁面功能簡介

### 後端文件
- [**後端架構**](../backend/README.zh-TW.md) — API 與伺服器架構
- [**API 文件**](../backend/docs/API.zh-TW.md) — REST API 參考
- [**WebSocket 事件**](../backend/docs/WEBSOCKET.zh-TW.md) — 即時事件
