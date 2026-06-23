# 🎆 Crackers Shop - MERN Stack Project

This project is a high-end, responsive e-commerce platform for selling crackers. It features a premium "WOW" design with glassmorphism, instant product filtering, and a robust admin dashboard for bulk price updates via CSV.

## ✨ Features
- **Customer Side**:
  - ✨ **Premium UI**: Dark mode with festive gold/orange gradients.
  - 🛍️ **Smart Cart**: Add/remove/update quantities easily.
  - 🔍 **Search & Filter**: Find crackers by name or category instantly.
  - 💳 **Post-Order Payment**: Automatic generation of QR codes and bank details.
  - 💬 **WhatsApp Integration**: Single-tap to share order screenshots.
- **Admin Side**:
  - 📊 **Orders Dashboard**: Real-time view of all customer orders.
  - 📁 **CSV Bulk Upload**: Instantly update thousands of prices or products via a single CSV file.

## 🛠️ Technology Stack
- **Frontend**: Vite + React, Vanilla CSS (Premium Design), Lucide Icons.
- **Backend**: Node.js, Express, MongoDB.
- **Utilities**: Multer (File uploads), CSV-Parser.

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js**: Installed on your system.
- **MongoDB**: You can use a local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```
*Wait for "🚀 Server running on http://localhost:5000" message.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Open the provided local URL (usually http://localhost:5173).*

### 4. How to use Admin Upload
1. Go to the Website and click the **Admin** button in the navbar.
2. Select the `sample_crackers.csv` file from the project root.
3. Click **Update Database**.
4. Return to the **Shop** view to see the updated products and prices with images!

## 📁 File Structure
- `crackers-shop/`
  - `backend/server.js` - Core API logic.
  - `frontend/src/App.jsx` - Main application & Cart logic.
  - `frontend/src/index.css` - Custom premium styling.
  - `sample_crackers.csv` - Template for bulk updates.
