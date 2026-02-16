# Database Seeding

Seeding is implemented in `src/seed/seed.service.ts` and runs in two modes:

1. Automatically on app startup (`OnModuleInit`)
2. Manually via `npm run seed`

---

## Seed Order

`SeedService.seed()` runs these steps in order:

1. `seedTables()`
2. `seedSuperAdmin()`
3. `seedStoreName()`

---

## Step Details

### Tables

- Inserts 10 tables (`tableNumber` 1-10, status `available`)
- Runs only when `tables` collection is empty

### Superadmin

- Uses env values:
    - `SUPERADMIN_USERNAME` (default `Charmy`)
    - `SUPERADMIN_PASSWORD` (default `Charmying`)
    - `RESET_SUPERADMIN` (default `false`)
- Behavior:
    - no superadmin -> create one
    - superadmin exists + `RESET_SUPERADMIN=true` -> reset credentials
    - superadmin exists + `RESET_SUPERADMIN=false` -> skip

### Store Name

- Ensures one default record exists:
    - `label: 店名`
    - `value: 餐廳點餐系統`
    - `isStoreName: true`
    - `isDeletable: false`
- Skips when an existing `isStoreName: true` record exists

---

## Manual Run

```bash
npm run seed
```

Runner behavior:

1. create application context
2. invoke `seedService.seed()`
3. close context and exit

---

## Safety Notes

1. Seeding is idempotent for tables and store-name baseline.
2. Superadmin reset is controlled by explicit env flag.
3. For production, avoid weak default credentials; always override username/password in secure env.
