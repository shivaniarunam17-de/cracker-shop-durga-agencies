# 🧨 DURGA AGENCIES — Complete Admin & User Guide
### Future Reference Document | Last Updated: April 2026

---

## 📋 TABLE OF CONTENTS
1. [Project Start Panna](#1-project-start-panna)
2. [MySQL Workbench Connect](#2-mysql-workbench-connect)
3. [Admin Portal — How to Use](#3-admin-portal)
4. [Products — Category List & Add](#4-products-category-add)
5. [Walk-in Bill — Shop Customer](#5-walkin-bill)
6. [Online Orders — Flow](#6-online-orders)
7. [Order Sessions — Date Control](#7-order-sessions)
8. [Bill System — Print](#8-bill-print)
9. [WhatsApp Notification](#9-whatsapp)
10. [Database Table Reference](#10-database)
11. [Important Files & Folders](#11-files)
12. [Passwords & Config](#12-config)

---

## 1. Project Start Panna

Every day **2 terminals** open pannu:

### Terminal 1 — Backend
```
cd d:\crackers\crackers-shop\backend
node server.js
```
✅ `MySQL Connected & Database Ready!` — varadha na MySQL service start panniruka confirm pannu

### Terminal 2 — Frontend
```
cd d:\crackers\crackers-shop\frontend
npm run dev
```
🌐 Browser la open: `http://localhost:5173`

---

## 2. MySQL Workbench Connect

### One-time Setup:
| Field | Value |
|---|---|
| Connection Name | Durga Agencies Shop |
| Hostname | localhost |
| Port | 3306 |
| Username | root |
| Password | 1234 |

### Data View Panna:
1. Connection open pannu
2. Left panel la `crackers_shop` expand pannu
3. Any table → right-click → **Select Rows — Limit 1000**

### SQL File Import (First Time Only):
1. File → Open SQL Script → `d:\crackers\crackers-shop\backend\crackers_shop.sql`
2. ⚡ Execute All button click pannu

---

## 3. Admin Portal

### Login:
- Website la **footer-la** `ADMIN PORTAL` link → click pannu
- Password: **`durga7604`**

### Admin-la 4 Tabs Iruku:

| Tab | Enna Pannum |
|---|---|
| 📋 Orders | All online + walk-in orders view pannum, bill reprint pannum |
| 🏪 Walk-in Bill | Shop la vandha customer ku bill create pannum |
| 📦 Products | New product add, CSV bulk import |
| 🗓️ Order Sessions | Online order open/close dates set pannum |

---

## 4. Products — Category List & Add

### Categories (Admin la available):

| Category Name | Enna Maathiri Items |
|---|---|
| Single Sound | Lakshmi, Kuruvi, Double Sound |
| Garlands | 1000 Wala, 2000 Wala, 5000 Wala (Charam) |
| Crakcers | General crackers |
| Sparklers | 7cm, 10cm, 15cm, 30cm, 50cm Electric Sparklers |
| Chakkars | Ground Chakkar, Zamin Chakkar |
| Pots | Flower Pots, Ashoka, Color Koti |
| Rockets | Sky rockets |
| Aerial Fancy | 12 Shots, 60 Shots, 120 Shots, 240 Shots Sky Display |
| Sound Crackers | Heavy sound items |
| Morning Crackers | Smoke crackers, Confetti |
| Novelty | Peacock Fountain, Photo Flash |
| Gift Boxes | Standard Box, Special Box, Family Pack |
| Kids Selection | Magic Pops, Snake Eggs |
| Bijili | Red Bijili, Stripped Bijili |

### How to Add a Product (Admin Portal):
1. Admin login → **📦 Products** tab
2. Fill fields:
   - **Cracker Name** → e.g. `Flower Pot Special`
   - **Category** → dropdown la select
   - **MRP (₹)** → e.g. `2250` (original price)
   - **Offer %** → e.g. `80` (80% offer)
   - *(Final price auto-calculate: 2250 - 80% = ₹450)*
3. **ADD PRODUCT** button click

### How to Bulk Add via CSV:
CSV file format (Excel la save as CSV):
```
name,category,originalPrice,offer,image,stock
Ground Chakkar Big,Chakkars,1250,80,,100
Flower Pots Special,Pots,2250,80,,100
```
Admin → 📦 Products tab → **SYNC DATABASE FROM CSV** → upload

> ⚠️ CSV upload antha pothu **all products replace** aagum. Full list podanum.

---

## 5. Walk-in Bill — Shop Customer

**Shop la vandha customer ku bill poda:**

1. Admin Portal → **🏪 Walk-in Bill** tab
2. **Left side** — Search & Add Products:
   - Search box la item name type pannu
   - **+ Add** button click pannu (multiple items add pannalaam)
3. **Right side** — Bill Builder:
   - Customer Name (optional)
   - Customer Phone (optional)
   - Payment Method select: **Cash / UPI / Card**
4. **GENERATE & PRINT BILL** click pannu
5. Bill preview open aagum → **🖨️ Print Both Copies** click

### Print Aana Bill-la Enna Irukum:
```
┌────────────────────────────┐
│ [Logo] DURGA AGENCIES      │  ← CUSTOMER COPY (customer ku kudu)
│ Bill No: DA-2026-0001      │
│ Items: Name | MRP | % | ₹  │
│ Grand Total: ₹950          │
└────────────────────────────┘
✂ ─────── CUT HERE ─────── ✂
┌────────────────────────────┐
│ [Logo] DURGA AGENCIES      │  ← ADMIN COPY (keep pannu)
│ (Same bill, admin tagged)  │
└────────────────────────────┘
```
- **Cut line** la kattri → customer ku oru copy, neenga oru copy vechu ko

---

## 6. Online Orders — Flow

### Customer Side:
1. Website open → products browse → quantity select
2. Min order: **₹3000** (ithuku keezhae checkout button appear aagaathu)
3. Checkout → Name, Phone, Address fill → **Confirm Order**
4. **Bill auto-generate** → DA-2026-XXXX format
5. Customer screen-la bill appear aagum (printable)

### Admin Side (Automatic):
- Order place aana **1 second-la** admin WhatsApp open aagum
- Message ready-aana format la send pannalaam with all details

---

## 7. Order Sessions — Date Control

**Online ordering enable/disable panna use pannum.**

### Session Illana:
- Orders always open (default)

### Session Create Panna:
1. Admin → **🗓️ Order Sessions** tab
2. Fill:
   - Session Name: `Diwali 2026`
   - Start: `2026-10-15 09:00`
   - End: `2026-11-05 23:59`
3. **CREATE SESSION** click

### Session States:
| Badge | Meaning |
|---|---|
| 🟢 LIVE | Ippothu orders open |
| 🟡 UPCOMING | Future-la open aagum |
| ⚫ EXPIRED | Date kadanthachu |

### Orders Closed Aana Customer Pakura Screen:
- "🧨 Online Orders Closed" banner show aagum
- Next available date show aagum
- Phone number show aagum (urgent orders call ku)
- Checkout button disappear aagum

---

## 8. Bill System — Print

### Bill Number Format:
```
DA-2026-0001
│  │    └─── 4-digit running number (resets each year)
│  └──────── Year
└─────────── Durga Agencies prefix
```

### Reprint Old Bill:
Admin → 📋 Orders tab → Bill row la **🖨️ icon** click

### Print Settings (Browser):
- Paper Size: **A5**
- Margins: **Minimum / None**
- Scale: **100%**
- ✅ Background Graphics enable

### Bill Contents:
- Company logo, name, address
- Bill number, date, time
- Customer name, phone, address
- Item table: Name | MRP (struck out) | Offer% | Rate | Qty | Total
- Grand Total, Savings amount
- Payment method
- Thank you note

---

## 9. WhatsApp Notification

### Admin ku Varum Message Format:
```
🧨 *NEW ORDER - DA-2026-0001*
━━━━━━━━━━━━━━━━
👤 *Customer:* Ravi Kumar
📞 *Phone:* 9876543210
📍 *Address:* 123 Main St, Chennai
━━━━━━━━━━━━━━━━
🛒 *Items:*
  1. Ground Chakkar Big x2 = ₹500.00
  2. Flower Pots Special x1 = ₹450.00
━━━━━━━━━━━━━━━━
💰 *Grand Total: ₹950.00*
📲 Reply to confirm order!
```

### Admin Number Change Panna:
File: `d:\crackers\crackers-shop\frontend\src\App.jsx`
Line ~305:
```js
const ADMIN_WHATSAPP = '917604849468';
// Format: 91 (India code) + 10 digit number — no spaces, no +
```

---

## 10. Database Table Reference

### Table 1: `products`
| Column | Type | Description |
|---|---|---|
| id | INT (Auto) | Unique product ID |
| name | VARCHAR | Cracker name |
| category | VARCHAR | Category (Sparklers, Pots etc.) |
| price | DECIMAL | Final price after offer |
| originalPrice | DECIMAL | MRP (before offer) |
| offer | INT | Offer percentage |
| image | TEXT | Image URL |
| stock | INT | Stock quantity |

### Table 2: `orders`
| Column | Type | Description |
|---|---|---|
| id | INT (Auto) | Order ID |
| billNumber | VARCHAR | DA-2026-XXXX |
| customerName | VARCHAR | Customer name |
| phone | VARCHAR | Mobile number |
| address | TEXT | Delivery address |
| totalAmount | DECIMAL | Final amount paid |
| originalTotal | DECIMAL | MRP total |
| totalSavings | DECIMAL | Money saved |
| paymentStatus | VARCHAR | Pending / Paid |
| paymentMethod | VARCHAR | Cash / UPI / Card |
| orderType | VARCHAR | online / walkin |
| orderDate | TIMESTAMP | Order date & time |

### Table 3: `order_items`
| Column | Type | Description |
|---|---|---|
| id | INT (Auto) | Row ID |
| orderId | INT | Links to orders.id |
| name | VARCHAR | Item name |
| originalPrice | DECIMAL | MRP of item |
| price | DECIMAL | Discounted price |
| offer | INT | Offer % of item |
| qty | INT | Quantity ordered |
| subtotal | DECIMAL | price × qty |

### Table 4: `order_sessions`
| Column | Type | Description |
|---|---|---|
| id | INT (Auto) | Session ID |
| label | VARCHAR | e.g. "Diwali 2026" |
| startDate | DATETIME | Orders open from |
| endDate | DATETIME | Orders close at |
| isActive | TINYINT | 1=enabled, 0=disabled |
| createdAt | TIMESTAMP | Created date |

---

## 11. Important Files & Folders

```
d:\crackers\crackers-shop\
│
├── backend\
│   ├── server.js          → All API routes, DB logic
│   ├── .env               → DB password, port config
│   ├── crackers_shop.sql  → SQL file — MySQL la import pannum
│   └── package.json       → Backend dependencies
│
├── frontend\
│   ├── src\
│   │   ├── App.jsx        → MAIN FILE — all UI, logic
│   │   ├── Bill.jsx       → Printable bill component
│   │   └── index.css      → All styles
│   ├── public\
│   │   └── logo.png       → Logo (favicon + navbar)
│   └── index.html         → Browser tab title + favicon
```

---

## 12. Passwords & Config

| Setting | Value |
|---|---|
| Admin Password | `durga7604` |
| DB Name | `crackers_shop` |
| DB User | `root` |
| DB Password | `1234` |
| Backend Port | `5000` |
| Frontend URL | `http://localhost:5173` |
| Admin WhatsApp | `917604849468` |
| Min Order Amount | ₹3000 |

### .env File Location:
```
d:\crackers\crackers-shop\backend\.env
```

---

## ⚡ Quick Reference Card

| Task | Where |
|---|---|
| Add new product | Admin → 📦 Products → Fill form |
| Bulk add products | Admin → 📦 Products → CSV Upload |
| Walk-in bill (shop customer) | Admin → 🏪 Walk-in Bill |
| View all orders | Admin → 📋 Orders |
| Reprint old bill | Admin → 📋 Orders → 🖨️ icon |
| Block orders (off-season) | Admin → 🗓️ Order Sessions → Create |
| Check DB data | MySQL Workbench → crackers_shop → Select Rows |
| Change price | MySQL Workbench → products table → Edit Row |

---

*Durga Agencies — Sivakasi Premium Crackers | Built with ❤️ by Antigravity*
