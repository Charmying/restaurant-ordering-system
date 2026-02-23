# 系統架構

[English](./ARCHITECTURE.md) | **繁體中文**

本文件定義預期在各功能間保持穩定的後端架構決策。

---

## 技術概況

| 層級 | 選擇 | 原因 |
|---|---|------|
| 框架 | NestJS 11 (Express 適配器) | 強模組邊界、DI、guard/filter/interceptor 模型 |
| 語言 | TypeScript 5 | DTO 與服務的型別安全契約 |
| 持久化 | MongoDB + Mongoose | 菜單/訂單工作流程的彈性文件模型 |
| 認證 | JWT (access + refresh) + Passport | 無狀態 access token 搭配 refresh 輪替 |
| 即時 | Socket.IO via Nest WebSocket gateway | 操作簡單的廣播事件模型 |
| 驗證 | Joi + class-validator | 啟動配置安全 + 請求邊界驗證 |
| API 文件 | Swagger/OpenAPI | 生成的契約搭配互動式 UI |

---

## 原始碼結構

```text
src/
    main.ts                  # bootstrap、全域 middleware/pipes、swagger、CORS
    app.module.ts            # 模組組合 + 全域 providers
    common/                  # decorators、guards、filters、interceptors、policies
    config/                  # 環境變數架構驗證
    modules/                 # 功能模組
    seed/                    # 啟動與手動種子流程
```

功能模組使用可預測的佈局：

```text
<feature>/
    dto/                     # 請求契約與驗證規則
    enums/                   # 領域列舉
    schemas/                 # mongoose schemas 與索引
    <feature>.controller.ts  # 傳輸層
    <feature>.service.ts     # 業務邏輯
    <feature>.module.ts      # 依賴連接
```

---

## 執行時管線

請求流程 (HTTP)：

```text
HTTP request
    -> Helmet middleware
    -> CORS policy
    -> ValidationPipe
    -> JwtAuthGuard (除非 @Public)
    -> RolesGuard (當 @Roles metadata 存在時)
    -> Controller
    -> Service
    -> TransformInterceptor
    -> HTTP response
```

錯誤流程：

```text
任何拋出的例外
    -> AllExceptionsFilter
    -> 標準化錯誤封裝
```

---

## API 封裝契約

### 成功
```json
{
  "success": true,
  "data": {}
}
```

### 錯誤
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

## 全域 Providers

在 `AppModule` 中全域註冊：

| Provider Token | 實作 | 目的 |
|---|---|------|
| `APP_GUARD` | `JwtAuthGuard` | 預設認證 |
| `APP_GUARD` | `RolesGuard` | 角色階層授權 |
| `APP_FILTER` | `AllExceptionsFilter` | 穩定的錯誤回應模型 |
| `APP_INTERCEPTOR` | `TransformInterceptor` | 穩定的成功回應模型 |

---

## 跨領域規則

- 所有端點都以 `/api` 為前綴
- 公開路由必須明確標記 `@Public()`
- 角色需求必須使用 `@Roles(...)` 或 `@ManagerOnly()`
- 輸入邊界強制使用 DTO 驗證
- 業務邏輯保留在服務類別

---

## 即時模型

- 命名空間：`/events`
- 模式：僅伺服器廣播 (`server.emit`)
- 當前設計中無客戶端到伺服器的事件命令 API

完整事件目錄請參閱 `websocket.zh-TW.md`。

---

## 配置邊界

- 環境變數在應用程式啟動前驗證
- 缺少必要變數在啟動時快速失敗
- CORS origin 列表從 `FRONTEND_URL` 衍生

---

## 文件不變性

如果以下任何項目變更，必須在同一 PR 中更新本文件：

1. 全域 middleware/guards/filter/interceptor 行為
2. API 封裝形狀
3. 模組層級邊界
4. 即時通訊模式
