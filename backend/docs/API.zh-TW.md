# API 契約指南

[English](./API.md) | **繁體中文**

所有路由都以 `/api` 為前綴。權威的端點契約在執行時生成：

- Swagger UI：`/api/docs`
- OpenAPI JSON：`/api/docs-json`

本文件記錄行為規則與整合關鍵注意事項。

---

## 回應封裝 (全域)

所有成功回應由 `TransformInterceptor` 包裝：

```json
{
  "success": true,
  "data": {}
}
```

所有錯誤由 `AllExceptionsFilter` 標準化：

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": []
  }
}
```

---

## 存取權限說明

| 標籤 | 意義 |
|---|---|
| Public | 不需要 JWT |
| Auth | 需要有效的 access token |
| Employee+ | `employee`、`manager`、`superadmin` |
| Manager+ | `manager`、`superadmin` |
| Superadmin | 僅 `superadmin` |

---

## 端點矩陣

### 健康檢查
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| GET | `/api/health` | Public | 回傳狀態、伺服器時間戳、運行時間 |

### 認證
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| POST | `/api/auth/login` | Public | 使用者名稱/密碼登入 |
| POST | `/api/auth/refresh` | Public | 輪替並回傳新的 access + refresh tokens |
| POST | `/api/auth/logout` | Auth | 清除持久化的 refresh token |
| GET | `/api/auth/verify` | Auth | 回傳當前 JWT payload |

### 使用者
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| GET | `/api/users` | Auth | Superadmin 看到全部，manager 看到 employees，employee 禁止 |
| POST | `/api/users` | Manager+ | Manager 無法建立同等/更高角色 |
| PUT | `/api/users/:id/password` | Auth | 自己的密碼或 manager+ 有角色限制 |
| DELETE | `/api/users/:id` | Manager+ | 無法刪除同等/更高角色 |

### 菜單
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| GET | `/api/menu` | Public | 僅 `available: true`，依 `categoryOrder` 排序 |
| GET | `/api/menu/:id` | Public | 找不到 → 404 |
| GET | `/api/menu/admin/all` | Manager+ | 包含不可用項目 |
| POST | `/api/menu` | Manager+ | 建立菜單項目 |
| PUT | `/api/menu/:id` | Manager+ | 部分更新 |
| DELETE | `/api/menu/:id` | Manager+ | 刪除菜單項目 |

### 訂單
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| POST | `/api/orders` | Public | 需要已佔用桌位與匹配的 QR token |
| GET | `/api/orders/pending` | Auth | 依最舊優先排序 |
| GET | `/api/orders/served` | Auth | 依最舊優先排序 |
| GET | `/api/orders/reports` | Manager+ | 已完成訂單 + 彙總摘要 |
| GET | `/api/orders` | Auth | 所有訂單，最新優先 |
| PUT | `/api/orders/:id/serve` | Auth | 僅允許從 `pending` |
| PUT | `/api/orders/:id/complete` | Auth | 僅允許從 `served` |
| PUT | `/api/orders/:id/cancel` | Auth | 已 `completed` 時阻擋 |
| POST | `/api/orders/reset` | Superadmin | 刪除所有訂單 |

### 桌位
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| GET | `/api/tables` | Auth | 依桌號排序 |
| POST | `/api/tables/:tableNumber/activate` | Auth | 需要 `available`；生成 UUID token + QR |
| POST | `/api/tables/:tableNumber/checkout` | Auth | 需要 `occupied`；計算總額 |
| GET | `/api/tables/:tableNumber/orders` | Public | 當前會話活動訂單 |
| POST | `/api/tables/:tableNumber/complete-checkout` | Auth | 標記完成並重置桌位 |
| POST | `/api/tables/:tableNumber/force-reset` | Auth | 強制重置桌位 |

### 分類
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| GET | `/api/categories/order` | Public | 回傳合併的分類順序 |
| PUT | `/api/categories/order` | Manager+ | 更新標準順序 |

### 訊息
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| GET | `/api/messages` | Auth | 置頂優先排序 |
| POST | `/api/messages` | Auth | 建立訊息 |
| PUT | `/api/messages/:id` | Auth | 僅作者可編輯 |
| PUT | `/api/messages/:id/pin` | Manager+ | 置頂訊息 |
| PUT | `/api/messages/:id/unpin` | Manager+ | 取消置頂 |
| DELETE | `/api/messages/:id` | Auth | Manager+ 可刪除任何 |
| DELETE | `/api/messages/all` | Superadmin | 刪除所有訊息 |

### 服務呼叫
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| POST | `/api/service-calls` | Public | 每桌待處理呼叫的 upsert |
| GET | `/api/service-calls/pending` | Employee+ | 最舊優先 |
| PUT | `/api/service-calls/:id/handle` | Employee+ | 設定 `handledAt` |

### 店家資訊
| 方法 | 路徑 | 存取 | 注意事項 |
|---|---|---|------|
| GET | `/api/store-info` | Public | 依 `order` 排序 |
| POST | `/api/store-info` | Manager+ | 建立項目 |
| PUT | `/api/store-info/:id` | Manager+ | 更新項目 |
| DELETE | `/api/store-info/:id` | Superadmin | 不可刪除項目回傳 403 |

---

## 輸入驗證注意事項

- DTO 驗證使用 class-validator 搭配全域 `ValidationPipe`
- 未知欄位被拒絕 (`forbidNonWhitelisted: true`)
- 查詢參數被轉換 (`enableImplicitConversion: true`)

---

## 整合建議

1. 使用 Swagger/OpenAPI 進行型別化客戶端生成
2. 將封裝 (`success`、`data`、`error`) 視為穩定契約
3. 在前端明確處理 401/403/409/422
4. 實作 refresh token 輪替支援
