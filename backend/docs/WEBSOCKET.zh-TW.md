# WebSocket 事件契約

[English](./WEBSOCKET.md) | **繁體中文**

後端即時訊息使用 Socket.IO (`@nestjs/websockets`) 實作。

---

## 連線概況

| 鍵 | 值 |
|---|------|
| 命名空間 | `/events` |
| 傳輸 | Socket.IO |
| CORS | `origin: true` |
| 認證 | 無 (廣播頻道) |
| 方向 | 僅伺服器 -> 客戶端 |

客戶端範例：

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000/events');
socket.on('connect', () => console.log(socket.id));
```

---

## 發射架構

兩個發射入口點：

1. `EventsService.emit(...)` (由 menu/users 服務使用)
2. `EventsGateway.emit(...)` (由 orders/tables/messages/service-calls 服務直接使用)

兩者最終都到達：

```text
server.emit(eventName, payload)
```

目前未實作房間分段。

---

## 事件目錄

### 訂單
| 事件 | Payload | 觸發 |
|---|---|------|
| `order:created` | 完整訂單物件 | 訂單建立 |
| `order:served` | 完整訂單物件 | 訂單移至已上菜 |
| `order:completed` | 完整訂單物件 | 訂單完成 |
| `order:cancelled` | 完整訂單物件 | 訂單取消 |

### 桌位
| 事件 | Payload | 觸發 |
|---|---|------|
| `table:activated` | `{ tableNumber }` | 桌位啟動 |
| `table:checkoutStarted` | `{ tableNumber }` | 結帳開始 |
| `table:checkoutCompleted` | `{ tableNumber }` | 結帳完成 |
| `table:forceReset` | `{ tableNumber }` | 桌位強制重置 |

### 菜單
| 事件 | Payload | 觸發 |
|---|---|------|
| `menu.created` | `{ id, name }` | 菜單項目建立 |
| `menu.updated` | `{ id }` | 菜單項目更新 |
| `menu.deleted` | `{ id }` | 菜單項目刪除 |

### 使用者
| 事件 | Payload | 觸發 |
|---|---|------|
| `user.created` | `{ id, username, role }` | 使用者建立 |
| `user.deleted` | `{ id }` | 使用者刪除 |

### 訊息
| 事件 | Payload | 觸發 |
|---|---|------|
| `newMessage` | 完整訊息物件 | 訊息建立 |
| `messageUpdated` | 完整訊息物件 | 訊息編輯 |
| `messagePinned` | 完整訊息物件 | 置頂/取消置頂 |
| `messageDeleted` | `{ id }` | 訊息刪除 |
| `allMessagesDeleted` | `{}` | 所有訊息刪除 |

### 服務呼叫
| 事件 | Payload | 觸發 |
|---|---|------|
| `serviceCall` | 完整服務呼叫物件 | 服務呼叫建立/upserted |
| `serviceCallHandled` | 完整服務呼叫物件 | 服務呼叫處理 |

---

## 客戶端整合指南

1. 使用冪等客戶端處理器，因為重連可能重播狀態轉換
2. 將 payload 形狀視為版本化契約；破壞性變更需要協調的發布說明
3. 對於儀表板式 UI，結合事件訂閱與定期 API 對帳
4. 新增未知事件的防禦性處理以支援向前相容性
