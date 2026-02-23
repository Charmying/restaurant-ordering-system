# 依賴套件

[English](./DEPENDENCIES.md) | **繁體中文**

本文件總結前端 `package.json` 依賴套件及其使用方式。

---

## 執行時依賴

### Angular 核心
- **@angular/common** — 常用指令、管道與 HTTP 輔助工具
- **@angular/compiler** — 模板編譯
- **@angular/core** — Angular 核心執行時
- **@angular/forms** — 模板與響應式表單
- **@angular/platform-browser** — 瀏覽器專用渲染
- **@angular/router** — 路由、佈局組合與延遲載入

### 國際化
- **@ngx-translate/core** — 翻譯服務與管道 (基於 JSON)

### 工具
- **rxjs** — 響應式串流 (signals 互通與非同步資料)
- **tslib** — TypeScript 執行時輔助工具

---

## 工具與建置依賴

### 建置系統
- **@angular/build** — 應用程式建置器 (基於 esbuild)
- **@angular/cli** — Angular CLI
- **@angular/compiler-cli** — AOT 編譯器

### 樣式
- **tailwindcss** — 工具優先 CSS (v4)
- **@tailwindcss/postcss** — Tailwind v4 PostCSS 整合
- **postcss** — CSS 轉換管線

### 測試
- **jsdom** — 單元測試的 DOM 實作
- **vitest** — 單元測試執行器

### 語言
- **typescript** — TypeScript 編譯器

---

## 套件管理器

- **npm@10.9.4** — 鎖定的套件管理器版本
