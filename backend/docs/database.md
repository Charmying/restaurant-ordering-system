# Database Design

The backend uses MongoDB with Mongoose schemas under `src/modules/**/schemas`.
All schemas currently enable `timestamps: true`.

---

## Collection Overview

| Collection | Purpose |
|---|---|
| `users` | Staff accounts and auth state |
| `orders` | Customer orders and lifecycle status |
| `menuitems` | Menu configuration |
| `tables` | Table session and checkout state |
| `messages` | Internal team board |
| `servicecalls` | Customer support calls |
| `storeinfos` | Store metadata |
| `categoryorders` | Canonical category ordering |

---

## Schema Contracts

### User

- `username` unique, trimmed, min 2 max 50
- `password` min 6, `select: false`
- `role` enum (`employee`, `manager`, `superadmin`), default `employee`
- `refreshToken` optional, `select: false`
- pre-save hook re-hashes password when modified
- `toJSON` strips `password`, `refreshToken`, `__v`
- index: `{ role: 1 }`

### Order

- `tableNumber`, `items[]`, `total`, `token` required
- `status` enum default `pending`
- `completedAt` set when completed
- indexes:
    - `{ status: 1, createdAt: -1 }`
    - `{ tableNumber: 1, status: 1 }`
    - `{ token: 1 }`

Order item subdocument (`_id: false`):

- `menuItemId` (ObjectId ref `MenuItem`)
- `name`, `price`, `quantity`, `subtotal` required
- optional `customization` object

### MenuItem

- required: `name`, `price`
- optional with defaults: `description`, `category[]`, `categoryOrder`, `image`, `customFields[]`, `available`
- indexes:
    - `{ category: 1 }`
    - `{ available: 1 }`
    - `{ categoryOrder: 1 }`

Custom fields are embedded, `_id: false`.

### Table

- `tableNumber` unique
- `status` enum default `available`
- QR/session fields: `qrCodeUrl`, `qrCodeToken`, `qrCodeImage`
- checkout fields: `totalAmount`, `orderItems[]`
- indexes:
    - `{ status: 1 }`
    - `{ tableNumber: 1 }`

### Message

- fields: `userId`, `username`, `content`, `isPinned`
- index: `{ isPinned: -1, createdAt: -1 }`

### ServiceCall

- fields: `tableNumber`, `status` (`pending|handled`), `handledAt`
- indexes:
    - `{ status: 1, createdAt: 1 }`
    - unique partial `{ tableNumber: 1, status: 1 }` where `status = pending`

### StoreInfo

- fields: `label`, `value`, `order`, `isStoreName`, `isDeletable`
- indexes:
    - `{ order: 1 }`
    - unique partial `{ isStoreName: 1 }` where `isStoreName = true`

### CategoryOrder

- field: `categories: string[]`
- treated as singleton via `findOneAndUpdate(..., { upsert: true })`

---

## State Lifecycles

### Table Status

```text
available -> occupied -> checkout -> available
     ^                         |
     +------ force-reset ------+
```

### Order Status

```text
pending -> served -> completed
   |         |
   +-> cancelled <-+
```

---

## Design Notes

1. `Order.items` stores snapshots (`name`, `price`) to preserve historical accuracy when menu changes later.
2. Table session token isolates concurrent table sessions and prevents stale client ordering.
3. Unique partial indexes enforce business invariants at database level (single store name, single pending service call per table).
4. Authorization constraints remain in service layer; schema focuses on structural and index-level integrity.
