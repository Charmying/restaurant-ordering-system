# WebSocket Event Contract

Backend realtime messaging is implemented with Socket.IO (`@nestjs/websockets`).

---

## Connection Profile

| Key | Value |
|---|---|
| Namespace | `/events` |
| Transport | Socket.IO |
| CORS | `origin: true` |
| Auth | none (broadcast channel) |
| Direction | server -> client only |

Client example:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000/events');
socket.on('connect', () => console.log(socket.id));
```

---

## Emission Architecture

Two emission entry points:

1. `EventsService.emit(...)` (used by menu/users services)
2. `EventsGateway.emit(...)` (used directly by orders/tables/messages/service-calls services)

Both end at:

```text
server.emit(eventName, payload)
```

No room segmentation is currently implemented.

---

## Event Catalog

### Order

| Event | Payload | Trigger |
|---|---|---|
| `order:created` | full order object | order created |
| `order:served` | full order object | order moved to served |
| `order:completed` | full order object | order completed |
| `order:cancelled` | full order object | order cancelled |

### Table

| Event | Payload | Trigger |
|---|---|---|
| `table:activated` | `{ tableNumber }` | table activated |
| `table:checkoutStarted` | `{ tableNumber }` | checkout started |
| `table:checkoutCompleted` | `{ tableNumber }` | checkout completed |
| `table:forceReset` | `{ tableNumber }` | table force-reset |

### Menu

| Event | Payload | Trigger |
|---|---|---|
| `menu.created` | `{ id, name }` | menu item created |
| `menu.updated` | `{ id }` | menu item updated |
| `menu.deleted` | `{ id }` | menu item deleted |

### User

| Event | Payload | Trigger |
|---|---|---|
| `user.created` | `{ id, username, role }` | user created |
| `user.deleted` | `{ id }` | user deleted |

### Message

| Event | Payload | Trigger |
|---|---|---|
| `newMessage` | full message object | message created |
| `messageUpdated` | full message object | message edited |
| `messagePinned` | full message object | pin/unpin |
| `messageDeleted` | `{ id }` | message deleted |
| `allMessagesDeleted` | `{}` | all messages deleted |

### Service Call

| Event | Payload | Trigger |
|---|---|---|
| `serviceCall` | full service call object | service call created/upserted |
| `serviceCallHandled` | full service call object | service call handled |

---

## Client Integration Guidelines

1. Use idempotent client handlers because reconnects can replay state transitions.
2. Treat payload shape as versioned contract; breaking changes require coordinated release notes.
3. For dashboard-style UIs, combine event subscription with periodic API reconciliation.
4. Add defensive handling for unknown events to support forward compatibility.
