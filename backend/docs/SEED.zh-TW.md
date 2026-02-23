# 資料庫種子

[English](./SEED.md) | **繁體中文**

種子實作於 `src/seed/seed.service.ts` 並以兩種模式執行：

1. 應用程式啟動時自動執行 (`OnModuleInit`)
2. 透過 `npm run seed` 手動執行

---

## 種子順序

`SeedService.seed()` 依序執行這些步驟：

1. `seedTables()`
2. `seedSuperAdmin()`
3. `seedStoreName()`

---

## 步驟詳情

### 桌位
- 插入 10 個桌位 (`tableNumber` 1-10，狀態 `available`)
- 僅在 `tables` 集合為空時執行

### Superadmin
- 使用環境變數值：
    - `SUPERADMIN_USERNAME` (預設 `Charmy`)
    - `SUPERADMIN_PASSWORD` (預設 `Charmying`)
    - `RESET_SUPERADMIN` (預設 `false`)
- 行為：
    - 無 superadmin → 建立一個
    - superadmin 存在 + `RESET_SUPERADMIN=true` → 重置憑證
    - superadmin 存在 + `RESET_SUPERADMIN=false` → 跳過

### 店名
- 確保存在一個預設記錄：
    - `label: 店名`
    - `value: 餐廳點餐系統`
    - `isStoreName: true`
    - `isDeletable: false`
- 當存在 `isStoreName: true` 記錄時跳過

---

## 手動執行

```bash
npm run seed
```

執行器行為：

1. 建立應用程式上下文
2. 呼叫 `seedService.seed()`
3. 關閉上下文並退出

---

## 安全注意事項

1. 桌位與店名基準的種子是冪等的
2. Superadmin 重置由明確的環境變數旗標控制
3. 對於生產環境，避免弱預設憑證；始終在安全環境中覆寫使用者名稱/密碼
