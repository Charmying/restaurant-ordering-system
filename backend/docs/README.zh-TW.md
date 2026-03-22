# 後端文件

[English](./README.md) | **繁體中文**

## 範圍

本目錄描述的是現行的 **`node-api/`** 服務（NestJS、MongoDB、Socket.IO 等實作）。它是**該程式碼庫**的工程與維運權威說明，**不是**未來所有後端語言／框架的「與實作無關的共用規格書」。

若新增 **`java-api/`**、**`python-api/`** 等：請在該目錄下建立 **`docs/`**（或同等結構）撰寫該技術棧的設定、架構與依賴，並從 **[`../README.zh-TW.md`](../README.zh-TW.md)**（必要時亦於本檔）加上連結。若多個服務須遵守**同一套 HTTP 或即時事件契約**，請將**契約本身**放在 repo 根目錄的 **`docs/`**（例如 OpenAPI、事件字典），各 `*/docs` 則保留為**該執行環境的實作說明**。

---

## 📚 文件索引

### 🚀 入門指南
- [**設定指南**](./SETUP.zh-TW.md) — 本地開發環境、環境變數與疑難排解
- [**依賴套件**](./DEPENDENCIES.zh-TW.md) — 執行時與開發依賴套件的理由與使用方式

### 🏗️ 架構與設計
- [**架構概覽**](./ARCHITECTURE.zh-TW.md) — 系統設計、模組界線與架構模式
- [**資料庫設計**](./DATABASE.zh-TW.md) — 架構設計、資料生命週期流程與優化策略

### 🔌 API 與整合
- [**API 文件**](./API.zh-TW.md) — REST API 慣例、端點矩陣與回應格式
- [**認證**](./AUTH.zh-TW.md) — 認證流程、授權模型與角色權限控制
- [**WebSocket 事件**](./WEBSOCKET.zh-TW.md) — 即時事件契約與 Socket.IO 實作

### 🌱 資料管理
- [**資料庫種子**](./SEED.zh-TW.md) — 啟動種子行為、手動種子執行與測試資料管理

### 🚀 維運與部署
- [**維運指南**](./OPERATIONS.zh-TW.md) — 生產環境手冊、事件處理與監控

---

## 🔍 依角色快速導覽

### 後端開發者
1. [設定指南](./SETUP.zh-TW.md) — 啟動你的開發環境
2. [架構概覽](./ARCHITECTURE.zh-TW.md) — 理解系統設計
3. [API 文件](./API.zh-TW.md) — 學習 API 模式與慣例
4. [資料庫設計](./DATABASE.zh-TW.md) — 理解資料模型與關聯

### 前端開發者
1. [API 文件](./API.zh-TW.md) — 理解可用端點與資料格式
2. [認證](./AUTH.zh-TW.md) — 學習認證流程與 token 處理
3. [WebSocket 事件](./WEBSOCKET.zh-TW.md) — 實作即時功能
4. [架構概覽](./ARCHITECTURE.zh-TW.md) — 理解後端模式

### DevOps 工程師
1. [維運指南](./OPERATIONS.zh-TW.md) — 部署與生產程序
2. [設定指南](./SETUP.zh-TW.md) — 環境配置與需求
3. [依賴套件](./DEPENDENCIES.zh-TW.md) — 套件需求與版本
4. [資料庫設計](./DATABASE.zh-TW.md) — 資料庫設定與優化

### QA 工程師
1. [API 文件](./API.zh-TW.md) — API 契約測試參考
2. [認證](./AUTH.zh-TW.md) — 安全測試情境
3. [資料庫種子](./SEED.zh-TW.md) — 測試資料設定程序
4. [設定指南](./SETUP.zh-TW.md) — 測試環境配置

---

## 📖 文件哲學

- **活文件** — 文件隨程式碼演進
- **實用範例** — 程式碼片段與真實使用模式
- **交叉參照** — 互連文件與清晰導覽
- **版本對齊** — 文件與程式碼版本一致

---

## 🔗 相關文件

### 系統層級文件
- [系統架構](../../docs/README.zh-TW.md) — 高階系統設計與原則
- [色彩系統](../../docs/color-system.zh-TW.md) — 設計 token 與 UI 指南
- [i18n 慣例](../../docs/architecture/i18n-naming.zh-TW.md) — 翻譯標準

### 前端文件
- [前端架構](../../frontend/README.zh-TW.md) — Angular 客戶端架構
- [前端設定](../../frontend/docs/SETUP.zh-TW.md) — 前端開發設定
- [前端依賴套件](../../frontend/docs/DEPENDENCIES.zh-TW.md) — 前端套件文件

### 外部參考
- [NestJS 文件](https://docs.nestjs.com/) — 框架參考與模式
- [MongoDB 文件](https://docs.mongodb.com/) — 資料庫參考與優化
- [Socket.IO 文件](https://socket.io/docs/) — 即時通訊參考
- [JWT 手冊](https://jwt.io/) — JSON Web Token 實作指南
