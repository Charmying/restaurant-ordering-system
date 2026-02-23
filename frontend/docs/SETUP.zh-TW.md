# 專案初始化與本地設定

[English](./SETUP.md) | **繁體中文**

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
- npm (專案在 `package.json` 中宣告 `npm@10.9.4`)
- 支援 ES2022 的現代瀏覽器

---

## 本地開發

```bash
npm install
npm start
```

開發伺服器預設運行於 `http://localhost:4200/`。

---

## 建置與測試

```bash
npm run build
npm test
```

---

## 注意事項

- 靜態資源從 `public/` 提供 (在 `angular.json` 中配置)
- 設計 token 位於 `src/styles.css` 並透過 CSS 變數套用

---

## 疑難排解

### 埠號已被使用
如果埠號 4200 被佔用，執行：

```bash
npm start -- --port 4201
```

### 建置或安裝錯誤
清除快取並重新安裝依賴：

```bash
rm -rf node_modules package-lock.json
npm install
```
