# 依賴架構

[English](./DEPENDENCIES.md) | **繁體中文**

本文件解釋依賴存在的原因與引入新依賴的限制。套件宣告於 NestJS 服務的 **`backend/node-api/package.json`**。若日後新增其他後端（例如 `java-api/`），各服務應維護各自的相依清單。

---

## 執行時依賴

### 平台
- `@nestjs/common`、`@nestjs/core`、`@nestjs/platform-express`
    - 框架執行時、DI、controller/guard/filter/interceptor 原語

### 配置
- `@nestjs/config`
    - 服務中的型別化配置存取
- `joi`
    - 啟動時環境契約驗證

### 資料層
- `@nestjs/mongoose`、`mongoose`
    - schema 定義、模型注入、查詢與聚合

### 認證
- `@nestjs/jwt`、`@nestjs/passport`、`passport`、`passport-jwt`
    - JWT 簽署/驗證與認證策略整合

### 即時
- `@nestjs/websockets`、`@nestjs/platform-socket.io`、`socket.io`
    - 伺服器端事件廣播命名空間

### API 文件
- `@nestjs/swagger`
    - OpenAPI 生成與 Swagger UI

### 安全與驗證
- `bcryptjs`
    - 密碼雜湊
- `helmet`
    - HTTP 標頭強化
- `class-validator`、`class-transformer`
    - DTO 驗證與請求轉換

### 工具
- `qrcode`
    - 桌位啟動流程的 QR 圖片生成
- `uuid`
    - 會話 token 生成
- `reflect-metadata`、`rxjs`
    - NestJS 執行時生態系統需求

---

## 開發依賴

### 工具鏈
- `@nestjs/cli`、`@nestjs/schematics`
- `typescript`、`ts-node`、`tsconfig-paths`

### 程式碼品質
- `eslint`、`@eslint/js`、`typescript-eslint`
- `prettier`、`eslint-config-prettier`、`eslint-plugin-prettier`
- `globals`

### 測試
- `@nestjs/testing`、`jest`、`ts-jest`、`supertest`

### 型別定義
- 執行時函式庫與測試工具的 `@types/*` 套件

---

## 依賴治理規則

1. 僅在明確能力缺口時新增依賴
2. 優先選擇成熟且廣泛維護的函式庫
3. 最小化重疊
4. 保持執行時依賴表面小以降低安全與升級風險
5. 對於每個新依賴，記錄：
    - 為何內建程式碼不足
    - 在哪裡使用
    - 預期的長期維護負擔

---

## 升級策略

1. 在專注的 PR 中更新依賴
2. 執行
    - lint
    - 單元測試
    - e2e 測試
3. 重新驗證
    - 認證流程
    - 種子流程
    - websocket 事件發射
4. 如果行為或配置變更，更新文件
