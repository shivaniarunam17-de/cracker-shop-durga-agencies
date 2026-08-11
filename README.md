# 🎆 Crackers Shop - Durga Agencies

This project is a high-end, responsive e-commerce platform for selling crackers. It features a premium "WOW" design with glassmorphism, instant product filtering, and a robust admin dashboard for bulk price updates via CSV.

## ✨ Features
- **Customer Side**:
  - ✨ **Premium UI**: Dark mode with festive gold/orange gradients.
  - 🛍️ **Smart Cart**: Add/remove/update quantities easily.
  - 🔍 **Search & Filter**: Find crackers by name or category instantly.
  - 💳 **Post-Order Payment**: Automatic generation of QR codes and bank details.
  - 💬 **WhatsApp Integration**: Single-tap to share order screenshots.
- **Admin Side**:
  - 🔐 **Secure Login**: JWT-based admin authentication.
  - 📊 **Orders Dashboard**: Real-time view of all customer orders.
  - 🧾 **Walk-in Billing**: Create bills for in-shop customers.
  - 📁 **CSV Bulk Upload**: Instantly update thousands of prices or products via a single CSV file.
  - 🖼️ **Cloudinary Image Upload**: Bulk-link product images via cloud storage.
  - ⚙️ **Session Management**: Control when online ordering is open or closed.
  - 🛒 **Settings Panel**: Update UPI ID, promo banners, shipping cost, and more.

## 🛠️ Technology Stack
- **Frontend**: Vite + React, Vanilla CSS (Premium Design), Lucide Icons.
- **Backend**: Node.js, Express.js, MySQL (via `mysql2`).
- **Image Storage**: Cloudinary (via `multer-storage-cloudinary`).
- **Utilities**: Multer (File uploads), CSV-Parser, dotenv.

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js**: Installed on your system.
- **MySQL**: A running MySQL server (local or cloud, e.g. PlanetScale / Railway).

### 2. Environment Variables
Create a `.env` file inside the `backend/` folder with the following:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crackers_shop
DB_SSL=false

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_PASSWORD=your_admin_password
FRONTEND_URL=http://localhost:5173
```

### 3. Backend Setup
```bash
cd backend
npm install
node server.js
```
*Wait for "🚀 Server running on http://localhost:5000" message.*

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Open the provided local URL (usually http://localhost:5173).*

### 5. How to use Admin Upload
1. Go to the Website and click the **Admin** button in the navbar.
2. Select the `sample_crackers.csv` file from the project root.
3. Click **Update Database**.
4. Return to the **Shop** view to see the updated products and prices with images!

## 📁 File Structure
- `crackers-shop/`
  - `backend/server.js` - Core API logic (MySQL, Cloudinary, JWT Auth).
  - `frontend/src/App.jsx` - Main application & Cart logic.
  - `frontend/src/index.css` - Custom premium styling.
  - `sample_crackers.csv` - Template for bulk product updates.
