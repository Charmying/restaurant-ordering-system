# 認證與授權

[English](./AUTH.md) | **繁體中文**

後端使用雙 JWT token (access + refresh) 與角色階層授權。

---

## 設計目標

1. 保持請求認證無狀態 (access token)
2. 允許長期會話搭配 token 輪替 (refresh token)
3. 套用預設拒絕的 API 存取
4. 透過 guard + policy 邏輯集中執行角色規則

---

## 認證生命週期

### 登入
`POST /api/auth/login`

- 驗證使用者名稱/密碼
- 比對密碼與 bcrypt 雜湊 (12 rounds)
- 發行 access + refresh tokens
- 持久化 refresh token

### 刷新
`POST /api/auth/refresh`

- 驗證 refresh token 簽章
- 驗證 token 與儲存的 refresh token
- 輪替 access 與 refresh tokens
- 替換持久化的 refresh token

### 已認證請求
- `JwtAuthGuard` 驗證 access token
- `JwtStrategy` 驗證使用者存在
- `RolesGuard` 執行角色 metadata

### 登出
`POST /api/auth/logout`

- 清除儲存的 refresh token
- 現有 access token 在到期前保持有效

---

## Token 配置

| Token | Secret 環境變數 | 到期環境變數 | 預設 |
|---|---|---|------|
| Access | `JWT_ACCESS_SECRET` | `JWT_ACCESS_EXPIRES_IN` | `24h` |
| Refresh | `JWT_REFRESH_SECRET` | `JWT_REFRESH_EXPIRES_IN` | `30d` |

Secrets 必須至少 32 字元。

---

## JWT Payload 契約

```typescript
interface JwtPayload {
  userId: string;
  username: string;
  role: 'employee' | 'manager' | 'superadmin';
}
```

---

## 授權模型

角色階層 (`ROLE_HIERARCHY`)：

- `employee` = 1
- `manager` = 2
- `superadmin` = 3

策略檢查：

```text
hasSufficientRole(userRole, requiredRole)
=> ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
```

---

## Guard 行為

### `JwtAuthGuard` (全域)
- 套用至所有路由，除非 `@Public()`
- 從 `Authorization` 標頭讀取 bearer token

### `RolesGuard` (全域)
- 在 auth guard 之後執行
- 如果沒有 `@Roles(...)` metadata，通過
- 使用者必須滿足至少一個必要角色

---

## 裝飾器

- `@Public()` - 繞過 JWT guard
- `@Roles(...roles)` - 路由層級授權需求
- `@ManagerOnly()` - `@Roles(manager)` 的簡寫
- `@CurrentUser(field?)` - 提取 payload 或欄位

---

## 已實施的安全控制

| 控制 | 實作 |
|---|------|
| 密碼雜湊 | bcrypt pre-save hook (12 rounds) |
| 隱藏敏感欄位 | `password` 與 `refreshToken` 使用 `select: false` |
| 輸出清理 | user schema `toJSON` 移除敏感欄位 |
| Refresh 失效 | 登出時移除儲存的 refresh token |
| Refresh 輪替 | refresh 端點發行並儲存新 token |
| HTTP 標頭強化 | Helmet middleware |
| CORS | 從配置衍生的 origin 允許清單 |

---

## 維運建議

1. 在生產環境使用短 access token 生命週期
2. 從 secret 管理器使用強隨機 secrets
3. 透過計劃維護視窗輪替 JWT secrets
4. 監控 401/403 激增作為潛在攻擊信號
