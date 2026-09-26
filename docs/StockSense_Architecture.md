# StockSense — Inventory Management System
## Architecture & Project Structure

---

## 1. Overview

StockSense is a modular Inventory Management System (IMS) built to replace manual registers and spreadsheets with a centralized, real-time stock tracking app.

**Target Users**
- Inventory Managers — manage incoming & outgoing stock
- Warehouse Staff — transfers, picking, shelving, counting

**Suggested Stack**
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT + OTP-based password reset

---

## 2. Folder Structure

```
StockSense/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Button, Modal, Table, Loader, StatusBadge
│   │   │   ├── dashboard/        # KpiCard, FilterBar, ActivityFeed
│   │   │   ├── products/         # ProductForm, ProductTable, CategoryPicker
│   │   │   ├── operations/       # ReceiptForm, DeliveryForm, TransferForm, AdjustmentForm
│   │   │   └── layout/           # Sidebar, Navbar, ProfileMenu
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx    # OTP-based reset
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Receipts.jsx
│   │   │   ├── ReceiptDetail.jsx
│   │   │   ├── Deliveries.jsx
│   │   │   ├── DeliveryDetail.jsx
│   │   │   ├── Transfers.jsx
│   │   │   ├── Adjustments.jsx
│   │   │   ├── Ledger.jsx
│   │   │   ├── Warehouses.jsx        # Settings > Warehouse
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── receiptService.js
│   │   │   ├── deliveryService.js
│   │   │   ├── transferService.js
│   │   │   ├── adjustmentService.js
│   │   │   └── dashboardService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── FilterContext.jsx     # dashboard filter state
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useStockAlerts.js
│   │   └── utils/
│   │       ├── validators.js
│   │       ├── formatters.js
│   │       └── constants.js          # status enums: Draft/Waiting/Ready/Done/Canceled
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── receiptController.js
│   │   │   ├── deliveryController.js
│   │   │   ├── transferController.js
│   │   │   ├── adjustmentController.js
│   │   │   ├── ledgerController.js
│   │   │   ├── warehouseController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── receiptRoutes.js
│   │   │   ├── deliveryRoutes.js
│   │   │   ├── transferRoutes.js
│   │   │   ├── adjustmentRoutes.js
│   │   │   ├── ledgerRoutes.js
│   │   │   ├── warehouseRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── Warehouse.js
│   │   │   ├── Location.js            # racks/bins within a warehouse
│   │   │   ├── StockLevel.js          # product x location quantity
│   │   │   ├── Receipt.js
│   │   │   ├── ReceiptLine.js
│   │   │   ├── DeliveryOrder.js
│   │   │   ├── DeliveryLine.js
│   │   │   ├── InternalTransfer.js
│   │   │   ├── StockAdjustment.js
│   │   │   └── StockLedgerEntry.js    # immutable audit log of every movement
│   │   ├── services/
│   │   │   ├── stockEngine.js         # core +/- stock logic, called by all operations
│   │   │   ├── reorderService.js      # low-stock alert logic
│   │   │   ├── otpService.js
│   │   │   └── notificationService.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT verification
│   │   │   ├── roleMiddleware.js      # Inventory Manager vs Warehouse Staff
│   │   │   ├── errorHandler.js
│   │   │   └── validateRequest.js
│   │   └── config/
│   │       ├── db.js
│   │       └── env.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── architecture.png
│   ├── er-diagram.png
│   └── api-documentation.md
│
└── README.md
```

---

## 3. Core Design Principle

Every stock-changing operation — **Receipt**, **Delivery**, **Internal Transfer**, **Adjustment** — must write to `stock_levels` **only** through `stockEngine.js`, and every change must also insert a row into `stock_ledger`. This keeps the ledger as the single source of truth and prevents stock drift between what's recorded and what's actually on the shelf.

```
Receipt / Delivery / Transfer / Adjustment
              │
              ▼
        stockEngine.js  ──────►  stock_levels (updated)
              │
              ▼
        stock_ledger (immutable log entry written)
```

---

## 4. Key Database Tables

| Table | Purpose |
|---|---|
| `users`, `otp_codes` | Auth & password reset |
| `products`, `categories` | Product catalog |
| `warehouses`, `locations` | Physical structure (warehouse → rack/bin) |
| `stock_levels` | Current quantity per product per location |
| `receipts`, `receipt_lines` | Incoming stock documents |
| `delivery_orders`, `delivery_lines` | Outgoing stock documents |
| `internal_transfers` | Location-to-location moves |
| `stock_adjustments` | Manual corrections after physical counts |
| `stock_ledger` | Immutable log: entry_type, product_id, from_location, to_location, qty_delta, ref_id, created_at |

---

## 5. Module Responsibilities

| Module | Responsibility |
|---|---|
| **Auth** | Signup/login, JWT issuance, OTP password reset |
| **Dashboard** | KPI aggregation, dynamic filters by doc type/status/warehouse/category |
| **Products** | CRUD, categories, reordering rules, per-location availability |
| **Receipts** | Vendor intake → validates → stock increases |
| **Deliveries** | Pick → pack → validate → stock decreases |
| **Transfers** | Location-to-location moves, stock total unchanged |
| **Adjustments** | Reconcile recorded vs. physical count |
| **Ledger** | Read-only audit trail of every stock movement |
| **Warehouses (Settings)** | Manage warehouses & locations |

---

## 6. Next Steps

- [ ] Generate `database/schema.sql` with full column definitions, types, and foreign keys
- [ ] Generate `er-diagram` for the schema above
- [ ] Define REST API contract (`api-documentation.md`)
- [ ] Scaffold backend routes/controllers per module
