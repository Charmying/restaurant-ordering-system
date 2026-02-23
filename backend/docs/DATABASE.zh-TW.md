# 資料庫設計

[English](./DATABASE.md) | **繁體中文**

後端使用 MongoDB 搭配 `src/modules/**/schemas` 下的 Mongoose schemas。
所有 schemas 都啟用 `timestamps: true`。

---

## 集合概覽

| 集合 | 目的 |
|---|------|
| `users` | 員工帳號與認證狀態 |
| `orders` | 顧客訂單與生命週期狀態 |
| `menuitems` | 菜單配置 |
| `tables` | 桌位會話與結帳狀態 |
| `messages` | 內部團隊留言板 |
| `servicecalls` | 顧客支援呼叫 |
| `storeinfos` | 店家元資料 |
| `categoryorders` | 標準分類排序 |

---

## Schema 契約

### User
- `username` 唯一、修剪、最小 2 最大 50
- `password` 最小 6、`select: false`
- `role` 列舉 (`employee`、`manager`、`superadmin`)、預設 `employee`
- `refreshToken` 可選、`select: false`
- pre-save hook 在修改時重新雜湊密碼
- `toJSON` 移除 `password`、`refreshToken`、`__v`
- 索引：`{ role: 1 }`

### Order
- `tableNumber`、`items[]`、`total`、`token` 必要
- `status` 列舉預設 `pending`
- `completedAt` 完成時設定
- 索引：
    - `{ status: 1, createdAt: -1 }`
    - `{ tableNumber: 1, status: 1 }`
    - `{ token: 1 }`

訂單項目子文件 (`_id: false`)：

- `menuItemId` (ObjectId ref `MenuItem`)
- `name`、`price`、`quantity`、`subtotal` 必要
- 可選 `customization` 物件

### MenuItem
- 必要：`name`、`price`
- 可選帶預設：`description`、`category[]`、`categoryOrder`、`image`、`customFields[]`、`available`
- 索引：
    - `{ category: 1 }`
    - `{ available: 1 }`
    - `{ categoryOrder: 1 }`

### Table
- `tableNumber` 唯一
- `status` 列舉預設 `available`
- QR/會話欄位：`qrCodeUrl`、`qrCodeToken`、`qrCodeImage`
- 結帳欄位：`totalAmount`、`orderItems[]`
- 索引：
    - `{ status: 1 }`
    - `{ tableNumber: 1 }`

### Message
- 欄位：`userId`、`username`、`content`、`isPinned`
- 索引：`{ isPinned: -1, createdAt: -1 }`

### ServiceCall
- 欄位：`tableNumber`、`status` (`pending|handled`)、`handledAt`
- 索引：
    - `{ status: 1, createdAt: 1 }`
    - 唯一部分 `{ tableNumber: 1, status: 1 }` 其中 `status = pending`

### StoreInfo
- 欄位：`label`、`value`、`order`、`isStoreName`、`isDeletable`
- 索引：
    - `{ order: 1 }`
    - 唯一部分 `{ isStoreName: 1 }` 其中 `isStoreName = true`

### CategoryOrder
- 欄位：`categories: string[]`
- 透過 `findOneAndUpdate(..., { upsert: true })` 視為單例

---

## 狀態生命週期

### 桌位狀態
```text
available -> occupied -> checkout -> available
    ^                       |
    +----- force-reset -----+
```

### 訂單狀態
```text
pending -> served -> completed
   |         |
   +-> cancelled <-+
```

---

## 設計注意事項

1. `Order.items` 儲存快照 (`name`、`price`)以保留歷史準確性
2. 桌位會話 token 隔離並發會話並防止過時客戶端點餐
3. 唯一部分索引在資料庫層級執行業務不變性
4. 授權限制保留在服務層
