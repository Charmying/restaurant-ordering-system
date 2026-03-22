# 專案初始化與本地設定

[English](./SETUP.md) | **繁體中文**

## Monorepo 目錄

可安裝依賴並執行的 Angular 應用位於 **`angular-app/`**（在 repo 的 `frontend/` 底下）。以下所有 `npm` 指令請在該目錄執行：

```bash
cd angular-app
```

套件設定見 `angular-app/package.json`（本 repo 於該檔宣告 `npm@10.9.4`）。

---

本前端使用 Angular CLI 初始化並支援 Tailwind CSS。

```bash
npx @angular/cli@latest new restaurant-ordering-system
```

選擇的選項：

- 樣式系統：Tailwind CSS
- 伺服器端渲染 (SSR)：否
- AI 工具：無

---

## 前置需求

- Node.js (Angular CLI 需要)
- npm（見 `angular-app/package.json` 中的工具鏈版本）
- 支援 ES2022 的現代瀏覽器

---

## 本地開發

```bash
cd angular-app
npm install
npm start
```

開發伺服器預設運行於 `http://localhost:4200/`。

---

## 建置與測試

```bash
cd angular-app
npm run build
npm test
```

---

## 注意事項

- 靜態資源從 `angular-app/public/` 提供（於 `angular-app/angular.json` 設定）
- 設計 token 位於 `angular-app/src/styles.css` 並透過 CSS 變數套用

---

## 疑難排解

### 埠號已被使用
如果埠號 4200 被佔用，執行：

```bash
cd angular-app
npm start -- --port 4201
```

### 建置或安裝錯誤
清除快取並重新安裝依賴：

```bash
cd angular-app
rm -rf node_modules package-lock.json
npm install
```
