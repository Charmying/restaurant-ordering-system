# 色彩系統

[English](./color-system.md) | **繁體中文**

為明暗主題設計的語意化色彩系統。Token 定義為 CSS 變數於 `frontend/src/styles.css`，並透過 `<html>` 的 `data-theme` 屬性套用。

## 核心原則

- **語意化 token**：使用基於意圖的變數 (例如 surface、text、border)
- **主題對等**：明暗值保持結構對齊
- **一致性**：共享間距、過渡與圓角
- **清晰度**：在各種狀態下維持可讀對比度

---

## 基礎 Token

### Surface (表面)
```css
--surface: 255 255 255;
--surface-elevated: 245 245 247;
--surface-muted: 235 235 238;
```

### Text (文字)
```css
--text-primary: 17 17 17;
--text-secondary: 85 85 85;
```

### Border (邊框)
```css
--border: 220 220 224;
```

---

## 互動元素

### Brand / Accent (品牌/強調)
```css
--primary: 17 24 39;
--primary-contrast: 255 255 255;
--accent: 59 130 246;
--accent-contrast: 255 255 255;
```

---

## 狀態色彩

### Destructive (破壞性)
```css
--destructive: 255 59 48;
--destructive-bg: 255 245 244;
```

### Ranking / Pinned (排名/置頂) (儀表板)
```css
--rank-1-bg: 254 249 195;
--rank-1-text: 133 77 14;
--rank-2-bg: 229 231 235;
--rank-2-text: 55 65 81;
--rank-3-bg: 254 215 170;
--rank-3-text: 154 52 18;

--pinned-bg: 255 251 235;
--pinned-border: 251 191 36;
--pinned-text: 146 64 14;
--pinned-badge-bg: 254 243 199;
--pinned-badge-text: 120 53 15;
--pinned-icon: 217 119 6;
```

---

## 效果

### Shadows (陰影)
- Card：`shadow-2xl`
- Button：`shadow-lg` → hover 時 `shadow-xl`
- Modal：`shadow-2xl` 搭配背景模糊

### Transitions (過渡)
- Duration：`200ms` (快速)、`300ms` (標準)
- Easing：`cubic-bezier(0.4, 0, 0.2, 1)`
- Scale：`scale-[1.03]` (hover)、`scale-[0.98]` (active)

### Radius (圓角)
- 佈局中使用 `rounded-lg`、`rounded-xl`、`rounded-2xl`

### Scrollbar (捲軸)
捲軸樣式由平台預設處理；除非無障礙需求，否則避免自訂樣式。

---

## 使用指南

1. **永遠使用 CSS 變數**來定義色彩
2. **優先使用語意名稱**而非色彩名稱
3. **測試兩種主題**再發布
4. **驗證對比度**用於關鍵文字
5. **使用過渡**進行主題切換

---

## 對比度需求

- 預設目標 **WCAG AA** (一般文字 4.5:1，大文字 3:1)
- 在 surface token 上使用 **text-primary** 作為主要內容
- 避免在長文字中使用強調色

---

## 主題實作

主題由 `frontend/src/styles.css` 中的 CSS 變數驅動：

- 明亮主題：`:root { ... }`
- 暗黑主題：`[data-theme='dark'] { ... }`

主題切換由前端 `ThemeService` 處理，它會在 `<html>` 上套用 `data-theme` 屬性並持久化使用者偏好。

---

## 使用範例

### 在元件樣式中
```css
.card {
  background-color: rgb(var(--surface-elevated));
  color: rgb(var(--text-primary));
  border: 1px solid rgb(var(--border));
}
```

### 在模板中 (Tailwind 任意值)
```html
<div class="bg-[rgb(var(--surface-elevated))] text-[rgb(var(--text-primary))]">
  內容
</div>
```
