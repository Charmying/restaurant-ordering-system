# i18n 命名慣例

[English](./i18n-naming.md) | **繁體中文**

## 原則

1. **鍵代表結構意圖，而非 UI 文案**

    - 鍵描述位置與原因，而非文字內容

2. **不要使用可見文字作為鍵**

    - ❌ `home.customerOrdering`
    - ✅ `page.home.entry.customer`

3. **依架構層級分組**

    - `layout.*` — 跨領域 UI 結構
    - `common.*` — 共享 UI 動作、狀態與訊息
    - `features.*` — 領域專用功能 (當前程式碼庫)
    - `language.*` — 語言切換標籤

4. **鍵應該自我說明**

    - 不需看到 UI 就能知道它在哪裡使用

---

## 結構

```text
layout.{component}.{element}
common.{action|status|message}
features.{domain}.{section}.{element}
language.{section}.{element}
```

---

## 範例

### Layout (跨頁面共享)
```text
layout.header.title
```

### Common (共享動作與狀態)
```text
common.cancel
common.save
common.processing
common.noData
```

### Feature (功能)
```text
features.home.hero.title
features.home.hero.subtitle
features.home.entry.customer
features.home.entry.admin
features.home.entry.customer.comingSoon
features.home.entry.admin.comingSoon
```

---

## 在模板中使用

```html
<div>
  {{ 'layout.header.title' | translate }}
</div>

<button disabled>
  {{ 'features.home.entry.customer' | translate }}
  <small>{{ 'features.home.entry.customer.comingSoon' | translate }}</small>
</button>
```

---

## 命名衝突

如果一個鍵可能屬於多個領域，優先選擇：

1. `common.*` 僅用於通用 UI 動作/狀態/訊息
2. `layout.*` 當它是共享佈局殼層的一部分
3. `features.*` 用於其他所有情況 (預設)

---

## 當前語言檔案

- `frontend/public/assets/i18n/en.json`
- `frontend/public/assets/i18n/zh.json`

---

## 為什麼這很重要

- **可擴展性**：10,000 個鍵仍保持組織性
- **重構**：更改 UI 文字無需觸碰程式碼
- **協作**：翻譯人員理解上下文
- **維護**：鍵的用途沒有歧義

---

## 現有鍵形式

當前翻譯檔案包含一些包含點的葉鍵 (例如 `features.home.entry.customer.description`)。這些鍵透過在模板和服務中引用完整字串鍵來使用。
