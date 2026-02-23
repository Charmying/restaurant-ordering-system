# 文件

[English](./README.md) | **繁體中文**

餐廳點餐系統的完整系統層級文件。本目錄包含適用於整個系統的跨領域文件。

---

## 🎯 目的

本文件作為以下內容的唯一真實來源：

- **系統架構** — 高階設計決策與架構模式
- **設計系統** — UI/UX 指南、色彩系統與主題
- **開發標準** — 編碼慣例、命名模式與最佳實踐
- **整合指南** — 前後端元件如何互動

---

## 📚 文件索引

### 設計系統
- [**色彩系統**](./color-system.zh-TW.md) — 語意化色彩 token、主題指南與設計原則

### 架構
- [**i18n 命名慣例**](./architecture/i18n-naming.zh-TW.md) — 翻譯鍵命名慣例與結構模式

---

## 🔍 依角色快速導覽

### 前端開發者
1. [前端架構](../frontend/README.zh-TW.md) — Angular 設定與元件組織
2. [色彩系統](./color-system.zh-TW.md) — 設計 token 與主題
3. [i18n 慣例](./architecture/i18n-naming.zh-TW.md) — 翻譯鍵模式
4. [前端設定](../frontend/docs/SETUP.zh-TW.md) — 本地開發環境

### 後端開發者
1. [後端架構](../backend/README.zh-TW.md) — NestJS 設定與模組組織
2. [API 文件](../backend/docs/API.zh-TW.md) — REST API 端點與契約
3. [資料庫架構](../backend/docs/DATABASE.zh-TW.md) — 資料模型與關聯
4. [認證](../backend/docs/AUTH.zh-TW.md) — 安全與授權

### 全端開發者
建議閱讀順序：
1. [系統概覽](../README.zh-TW.md) — 完整系統理解
2. [色彩系統](./color-system.zh-TW.md) — UI/UX 一致性
3. [i18n 慣例](./architecture/i18n-naming.zh-TW.md) — 翻譯模式
4. [前端架構](../frontend/README.zh-TW.md) — 客戶端結構
5. [後端架構](../backend/README.zh-TW.md) — 伺服器端結構
6. [API 文件](../backend/docs/API.zh-TW.md) — 整合點

### DevOps 工程師
從這裡開始：
1. [維運指南](../backend/docs/OPERATIONS.zh-TW.md) — 部署與維護
2. [後端設定](../backend/docs/SETUP.zh-TW.md) — 環境配置
3. [前端設定](../frontend/docs/SETUP.zh-TW.md) — 前端建置配置

---

## 📖 文件哲學

- **活文件** — 文件隨程式碼演進
- **實用範例** — 程式碼片段與真實使用模式
- **交叉參照** — 互連文件與清晰導覽
- **版本對齊** — 文件與程式碼版本一致

---

## 🔗 外部參考

### 官方文件
- [Angular 文件](https://angular.dev/docs) — 前端框架參考
- [NestJS 文件](https://docs.nestjs.com/) — 後端框架參考
- [MongoDB 文件](https://docs.mongodb.com/) — 資料庫參考
- [Tailwind CSS](https://tailwindcss.com/docs) — 樣式框架參考

### 標準與規範
- [REST API 設計](https://restfulapi.net/) — REST API 設計原則
- [WCAG 無障礙](https://www.w3.org/WAI/WCAG21/quickref/) — 網頁無障礙指南
