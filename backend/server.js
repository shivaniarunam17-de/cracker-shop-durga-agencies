import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import crypto from 'crypto';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// JWT Token Configuration & Helper Functions
const JWT_SECRET = process.env.JWT_SECRET || 'durga_agencies_secret_key_2026_rfv_tgb';

// Custom lightweight JWT generator (requires no external library)
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const stringifiedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${stringifiedPayload}`)
    .digest('base64url');
  return `${header}.${stringifiedPayload}.${signature}`;
}

// Custom lightweight JWT verifier
function verifyToken(token) {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;
    
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (decodedPayload.exp && decodedPayload.exp < Date.now()) return null;
    
    return decodedPayload;
  } catch (err) {
    return null;
  }
}

// Middleware to authenticate admin requests
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Access token missing' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
  req.admin = decoded;
  next();
};

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In production, reject unknown origins
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('CORS: Origin not allowed'));
    }
    return callback(null, true); // Allow all in dev
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' });

// MySQL Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crackers_shop',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
};

let db;

// Generate Bill Number: DA-2026-0001-A4F2 format (random 4-character suffix for security)
async function generateBillNumber() {
  const year = new Date().getFullYear();
  const [rows] = await db.query(
    'SELECT COUNT(*) as count FROM orders WHERE YEAR(orderDate) = ?', [year]
  );
  const count = rows[0].count + 1;
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `DA-${year}-${String(count).padStart(4, '0')}-${suffix}`;
}

async function initDB() {
  try {
    const tempDb = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl
    });

    await tempDb.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempDb.end();

    // Initialize Connection Pool
    db = mysql.createPool(dbConfig);
    console.log('✅ MySQL Connection Pool Created!');

    // Create products table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        originalPrice DECIMAL(10, 2) DEFAULT 0,
        offer INT DEFAULT 0,
        image LONGTEXT,
        stock INT DEFAULT 100
      )
    `);

    // Forceful check for missing columns (for existing databases)
    console.log("🛠️ Checking database schema for missing columns...");
    try { 
      await db.query("ALTER TABLE products ADD COLUMN originalPrice DECIMAL(10,2) DEFAULT 0 AFTER price"); 
      console.log("✅ Added originalPrice column!"); 
    } catch(e) {}
    
    try { 
      await db.query("ALTER TABLE products ADD COLUMN offer INT DEFAULT 0 AFTER originalPrice"); 
      console.log("✅ Added offer column!"); 
    } catch(e) {}
    
    try { 
      await db.query("ALTER TABLE products ADD UNIQUE (name)"); 
      console.log("✅ Added duplicate protection (Unique Name)!"); 
    } catch(e) {}
    
    console.log("🌟 Database 'DURGA AGENCIES' is fully optimized and READY!");

    // Orders table with billNumber and orderType
    await db.execute(`CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      billNumber VARCHAR(50) UNIQUE,
      customerName VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      totalAmount DECIMAL(10, 2),
      originalTotal DECIMAL(10, 2),
      totalSavings DECIMAL(10, 2),
      paymentStatus VARCHAR(50) DEFAULT 'Pending',
      paymentMethod VARCHAR(50) DEFAULT 'UPI',
      orderType VARCHAR(20) DEFAULT 'online',
      orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Order items table with full price info
    await db.execute(`CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT,
      productId VARCHAR(100),
      name VARCHAR(255),
      originalPrice DECIMAL(10, 2),
      price DECIMAL(10, 2),
      offer INT DEFAULT 0,
      qty INT,
      subtotal DECIMAL(10, 2),
      FOREIGN KEY (orderId) REFERENCES orders(id)
    )`);

    // Order sessions table — controls when online ordering is open
    await db.execute(`CREATE TABLE IF NOT EXISTS order_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      isActive TINYINT(1) DEFAULT 1,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Settings table for global config and offers
    await db.execute(`CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(50) PRIMARY KEY,
      \`value\` TEXT NOT NULL
    )`);

    // Seed default settings if they don't exist
    const defaultSettings = [
      { key: 'promo_title', value: 'FESTIVE DHAMAKA OFFERS!' },
      { key: 'promo_subtitle', value: 'UP TO 80% OFF ON SELECTED ITEMS' },
      { key: 'free_shipping_threshold', value: '999' },
      { key: 'global_discount_percent', value: '0' },
      { key: 'shipping_cost', value: '100' },
      { key: 'upi_id', value: '7604849468@gpay' },
      { key: 'admin_whatsapp_number', value: process.env.ADMIN_PHONE || '917604849468' },
      // Business info for bill / website
      { key: 'shop_phone', value: '+91 76048 49468, +91 91760 48494' },
      { key: 'shop_address', value: '2/553D, Mettamalai, Sivakasi - 626 230' },
      { key: 'shop_email', value: 'durgaagenciessvk@gmail.com' },
      { key: 'gst_number', value: '' }
    ];

    for (const setting of defaultSettings) {
      try {
        await db.execute('INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)', [setting.key, setting.value]);
      } catch (e) {}
    }

    // Add missing columns if upgrading old DB
    try { await db.execute(`ALTER TABLE orders ADD COLUMN billNumber VARCHAR(50) UNIQUE`); } catch(e) {}
    try { await db.execute(`ALTER TABLE orders ADD COLUMN originalTotal DECIMAL(10,2)`); } catch(e) {}
    try { await db.execute(`ALTER TABLE orders ADD COLUMN totalSavings DECIMAL(10,2)`); } catch(e) {}
    try { await db.execute(`ALTER TABLE orders ADD COLUMN paymentMethod VARCHAR(50) DEFAULT 'UPI'`); } catch(e) {}
    try { await db.execute(`ALTER TABLE orders ADD COLUMN orderType VARCHAR(20) DEFAULT 'online'`); } catch(e) {}
    try { await db.execute(`ALTER TABLE orders ADD COLUMN orderStatus VARCHAR(50) DEFAULT 'Pending Payment'`); } catch(e) {}
    try { await db.execute(`ALTER TABLE orders ADD COLUMN deliveryNote TEXT`); } catch(e) {}
    try { await db.execute(`ALTER TABLE order_items ADD COLUMN originalPrice DECIMAL(10,2)`); } catch(e) {}
    try { await db.execute(`ALTER TABLE order_items ADD COLUMN offer INT DEFAULT 0`); } catch(e) {}
    try { await db.execute(`ALTER TABLE order_items ADD COLUMN subtotal DECIMAL(10,2)`); } catch(e) {}

    // Migrate legacy bills: Update existing orders that don't have a 4-character suffix (e.g. length of 'DA-2026-0001' is 12)
    try {
      const [existingOrders] = await db.query("SELECT id, billNumber FROM orders WHERE LENGTH(billNumber) = 12 AND billNumber LIKE 'DA-%'");
      for (const ord of existingOrders) {
        const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
        const newBillNumber = `${ord.billNumber}-${randomSuffix}`;
        await db.execute("UPDATE orders SET billNumber = ? WHERE id = ?", [newBillNumber, ord.id]);
        console.log(`Updated legacy order ID ${ord.id} to new secure billNumber: ${newBillNumber}`);
      }
    } catch(e) {
      console.error("Migration error:", e);
    }

  } catch (err) {
    console.error('❌ Database Initialization Failed. Retrying in 10 seconds...', err.message);
    if (!db) {
      try {
        db = mysql.createPool(dbConfig);
      } catch (poolErr) {
        console.error('Failed to create fallback connection pool:', poolErr.message);
      }
    }
    setTimeout(initDB, 10000);
  }
}

initDB();

let whatsappClientReady = false;
let latestQrCode = null;
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

whatsappClient.on('qr', (qr) => {
    latestQrCode = qr;
    console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP TO ENABLE AUTO-MESSAGES:');
    qrcode.generate(qr, {small: true});
});

whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp Web Client is READY! Auto-messaging is active.');
    whatsappClientReady = true;
    latestQrCode = null;
});

whatsappClient.initialize().catch(err => console.error("WhatsApp Init Error:", err));

// --- ROUTES ---

// Expose QR code endpoint for easy scan
app.get('/qr', (req, res) => {
    if (whatsappClientReady) {
        return res.send(`
            <html>
                <head>
                    <title>WhatsApp Status</title>
                    <style>
                        body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f4f6f9; color: #333; }
                        .card { background: white; padding: 40px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .status { color: #2ecc71; font-weight: bold; font-size: 24px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>WhatsApp Status</h2>
                        <p class="status">✅ Connected & Ready!</p>
                        <p>Your WhatsApp account is successfully linked and active.</p>
                    </div>
                </body>
            </html>
        `);
    }

    if (!latestQrCode) {
        return res.send(`
            <html>
                <head>
                    <title>WhatsApp Status</title>
                    <style>
                        body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f4f6f9; color: #333; }
                        .card { background: white; padding: 40px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .status { color: #e67e22; font-weight: bold; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>WhatsApp Status</h2>
                        <p class="status">🔄 Generating QR code...</p>
                        <p>The server is starting or generating the WhatsApp session. Please refresh this page in a few seconds.</p>
                    </div>
                </body>
            </html>
        `);
    }

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQrCode)}`;
    res.send(`
        <html>
            <head>
                <title>Scan WhatsApp QR Code</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f4f6f9; color: #333; }
                    .card { background: white; padding: 40px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    img { margin: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
                    p { color: #666; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>Scan to Link WhatsApp</h2>
                    <p>Open WhatsApp on your phone, go to Linked Devices, and scan this QR code:</p>
                    <img src="${qrImageUrl}" alt="WhatsApp QR Code" />
                    <br/>
                    <p>Refresh this page if the scan fails or the code expires.</p>
                </div>
            </body>
        </html>
    `);
});


// WhatsApp Status API — used by Admin Panel WhatsApp tab
app.get('/api/whatsapp/status', (req, res) => {
  if (whatsappClientReady) {
    return res.json({ connected: true, qr: null });
  }
  if (latestQrCode) {
    return res.json({ connected: false, qr: latestQrCode });
  }
  res.json({ connected: false, qr: null }); // still initializing
});

// 1. Get all products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Place an Online Order (auto-generates bill)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, address, items, totalAmount, paymentMethod } = req.body;

    const billNumber = await generateBillNumber();

    const originalTotal = items.reduce((sum, i) => sum + ((i.originalPrice || i.price) * i.qty), 0);
    const savings = originalTotal - totalAmount;

    const [orderResult] = await db.execute(
      'INSERT INTO orders (billNumber, customerName, phone, address, totalAmount, originalTotal, totalSavings, paymentMethod, orderType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [billNumber, customerName, phone, address, totalAmount, originalTotal, savings, paymentMethod || 'UPI', 'online']
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      const subtotal = item.price * item.qty;
      await db.execute(
        'INSERT INTO order_items (orderId, productId, name, originalPrice, price, offer, qty, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.id || item._id, item.name, item.originalPrice || item.price, item.price, item.offer || 0, item.qty, subtotal]
      );
      // Automatically deduct inventory stock level
      await db.execute(
        'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
        [item.qty, item.id || item._id]
      );
    }

    // Return full bill data
    const bill = { billNumber, orderId, customerName, phone, address, items, totalAmount, originalTotal, savings, orderType: 'online', orderDate: new Date() };
    res.status(201).json({ message: 'Order Placed!', bill });

    // Background WhatsApp notification task
    // Always attempt — logs a warning if WA not ready, so admin knows to scan QR
    setTimeout(async () => {
      try {
        // Fetch admin whatsapp number from settings (consistent key: admin_whatsapp_number)
        const [settingsRows] = await db.query("SELECT `value` FROM settings WHERE `key` = 'admin_whatsapp_number'");
        const adminNumRaw = (settingsRows && settingsRows.length > 0)
          ? settingsRows[0].value
          : (process.env.ADMIN_PHONE || '917604849468');

        // Format customer phone (10-digit → add 91 prefix)
        let formattedPhone = phone ? phone.replace(/\D/g, '') : '';
        if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;
        const customerChatId = `${formattedPhone}@c.us`;

        // Format admin phone
        let adminNumber = adminNumRaw.replace(/\D/g, '');
        if (adminNumber.length === 10) adminNumber = `91${adminNumber}`;
        const adminChatId = `${adminNumber}@c.us`;

        const itemsList = items.map(i => `  • ${i.name} x${i.qty} = ₹${(i.price * i.qty).toFixed(2)}`).join('\n');

        const customerMsg =
          `🎉 *ஆர்டர் கிடைத்தது! Order Received!* 🎉\n\n` +
          `வணக்கம் ${customerName},\n` +
          `உங்கள் ஆர்டர் *DURGA AGENCIES*-ல் வெற்றிகரமாக பதிவாகியது.\n\n` +
          `💰 *Total Amount:* ₹${totalAmount}\n\n` +
          `*Items Ordered:*\n${itemsList}\n\n` +
          `⚠️ *Payment Instructions:*\n` +
          `நாங்கள் விரைவில் உங்களை தொடர்பு கொண்டு payment விவரங்களை தெரிவிப்போம்.\n\n` +
          `நன்றி! 🪔 Durga Agencies`;

        const adminMsg =
          `🚨 *புதிய ஆர்டர் வந்தது! NEW ORDER* 🚨\n\n` +
          `📦 *Order ID:* #${billNumber}\n` +
          `👤 *Customer:* ${customerName}\n` +
          `📱 *Phone:* ${phone}\n` +
          `💰 *Total:* ₹${totalAmount}\n` +
          `📍 *Address:* ${address}\n\n` +
          `*Items Ordered:*\n${itemsList}\n\n` +
          `_Customer-க்கு auto-message அனுப்பப்பட்டது._`;

        if (!whatsappClientReady) {
          console.warn('⚠️  WhatsApp not connected — order saved to DB but WA messages NOT sent. Scan QR at /qr to connect.');
          return;
        }

        // Send to Customer (only if phone provided)
        if (formattedPhone.length >= 12) {
          whatsappClient.sendMessage(customerChatId, customerMsg)
            .then(() => console.log(`✅ WA sent to customer ${formattedPhone}`))
            .catch(e => console.error('WA Send Error (Customer):', e.message));
        }

        // Send to Admin
        whatsappClient.sendMessage(adminChatId, adminMsg)
          .then(() => console.log(`✅ WA sent to admin ${adminNumber}`))
          .catch(e => console.error('WA Send Error (Admin):', e.message));

      } catch (e) {
        console.error('WhatsApp Message Processing Error:', e);
      }
    }, 1500);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Admin: Create Walk-in Bill (shop customer)
app.post('/api/admin/walkin-order', authenticateAdmin, async (req, res) => {
  try {
    const { customerName, phone, address, items, totalAmount, paymentMethod } = req.body;

    const billNumber = await generateBillNumber();
    const originalTotal = items.reduce((sum, i) => sum + ((i.originalPrice || i.price) * i.qty), 0);
    const savings = originalTotal - totalAmount;

    const [orderResult] = await db.execute(
      'INSERT INTO orders (billNumber, customerName, phone, address, totalAmount, originalTotal, totalSavings, paymentMethod, orderType, paymentStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [billNumber, customerName || 'Walk-in Customer', phone || '', address || 'Shop', totalAmount, originalTotal, savings, paymentMethod || 'Cash', 'walkin', 'Paid']
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      const subtotal = item.price * item.qty;
      await db.execute(
        'INSERT INTO order_items (orderId, productId, name, originalPrice, price, offer, qty, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.id || item._id || '', item.name, item.originalPrice || item.price, item.price, item.offer || 0, item.qty, subtotal]
      );
      // Automatically deduct inventory stock level
      const pId = item.id || item._id;
      if (pId) {
        await db.execute(
          'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
          [item.qty, pId]
        );
      }
    }

    const bill = { billNumber, orderId, customerName: customerName || 'Walk-in Customer', phone, address, items, totalAmount, originalTotal, savings, orderType: 'walkin', orderDate: new Date(), paymentMethod: paymentMethod || 'Cash' };
    res.status(201).json({ message: 'Walk-in Bill Created!', bill });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Bill by billNumber or orderId
app.get('/api/bill/:billNumber', async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE billNumber = ?', [req.params.billNumber]);
    if (!orders.length) return res.status(404).json({ error: 'Bill not found' });

    const order = orders[0];
    const [items] = await db.query('SELECT * FROM order_items WHERE orderId = ?', [order.id]);

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin: Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const SECRET_PASS = process.env.ADMIN_PASSWORD || 'durga7604';
  if (password === SECRET_PASS) {
    const token = generateToken({ role: 'admin', exp: Date.now() + 24 * 60 * 60 * 1000 });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Passkey' });
  }
});

// 6. Admin: Get all orders
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY orderDate DESC');
    // Attach items to each order
    for (const order of rows) {
      const [items] = await db.query('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
      order.items = items;
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Admin: Update order status / delivery note
app.patch('/api/admin/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { paymentStatus, orderStatus, deliveryNote } = req.body;
    const updates = [];
    const params = [];
    if (paymentStatus !== undefined) { updates.push('paymentStatus = ?'); params.push(paymentStatus); }
    if (orderStatus !== undefined) { updates.push('orderStatus = ?'); params.push(orderStatus); }
    if (deliveryNote !== undefined) { updates.push('deliveryNote = ?'); params.push(deliveryNote); }
    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    params.push(req.params.id);
    await db.execute(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Admin: Add single product
app.post('/api/admin/add-product', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, price, offer, image, stock } = req.body;
    const fixedPrice = parseFloat(price || 0);
    const offerPercent = parseInt(offer || 0);
    const fakeMRP = (offerPercent > 0 && offerPercent < 100) ? Math.round(fixedPrice / (1 - (offerPercent / 100))) : fixedPrice;
    
    await db.execute(
      'INSERT INTO products (name, category, price, originalPrice, offer, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, fixedPrice, fakeMRP, offerPercent, image || '', stock || 100]
    );
    res.json({ message: 'Product added successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8b. Admin: Update single product details (Stock / Price / Offer / Name)
app.patch('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, price, offer, stock } = req.body;
    const updates = [];
    const params = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (stock !== undefined) { updates.push('stock = ?'); params.push(stock); }

    if (price !== undefined || offer !== undefined) {
      const [prod] = await db.query('SELECT price, offer FROM products WHERE id = ?', [req.params.id]);
      const currentPrice = price !== undefined ? parseFloat(price) : parseFloat(prod[0]?.price || 0);
      const currentOffer = offer !== undefined ? parseInt(offer) : parseInt(prod[0]?.offer || 0);
      const fakeMRP = (currentOffer > 0 && currentOffer < 100) ? Math.round(currentPrice / (1 - (currentOffer / 100))) : currentPrice;
      
      updates.push('price = ?'); params.push(currentPrice);
      updates.push('offer = ?'); params.push(currentOffer);
      updates.push('originalPrice = ?'); params.push(fakeMRP);
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    
    await db.execute(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Product updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Admin: Upload CSV (Bulk Add/Update)
app.post('/api/admin/upload-csv', authenticateAdmin, upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const productsToUpdate = [];
  let errorMsg = null;

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => {
      const keys = Object.keys(data);
      const findKey = (str) => keys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === str.toLowerCase().replace(/[^a-z0-9]/g, ''));
      
      const name = data[findKey('name')];
      if (!name) return; 

      try {
        const fixedPrice = parseFloat(data[findKey('price')] || data[findKey('realRate')] || data[findKey('mrp')] || 0);
        const offer = parseInt(data[findKey('offer')] || data[findKey('discount')] || 0);
        const fakeMRP = (offer > 0 && offer < 100) ? Math.round(fixedPrice / (1 - (offer / 100))) : fixedPrice;
        const category = data[findKey('category')] || 'Single Sound';
        const image = data[findKey('image')] || '';
        const stock = parseInt(data[findKey('stock')] || 100);

        productsToUpdate.push([name, category, fixedPrice, fakeMRP, offer, image, stock]);
      } catch (err) {
        errorMsg = `Error in row for product "${name}". Check prices.`;
      }
    })
    .on('end', async () => {
      try {
        if (errorMsg) return res.status(400).json({ error: errorMsg });
        if (productsToUpdate.length === 0) return res.status(400).json({ error: "No valid product names found in CSV." });
        
        console.log(`Processing: ${productsToUpdate.length} rows`);
        const query = `
          INSERT INTO products (name, category, price, originalPrice, offer, image, stock) 
          VALUES ? 
          ON DUPLICATE KEY UPDATE 
          category=VALUES(category), 
          price=VALUES(price), 
          originalPrice=VALUES(originalPrice), 
          offer=VALUES(offer), 
          stock=VALUES(stock)
        `;
        await db.query(query, [productsToUpdate]);
        
        fs.unlinkSync(filePath);
        res.json({ message: 'Sync Successful!', count: productsToUpdate.length });
      } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ error: `Database Error: ${err.message}` });
      }
    });
});

// 10. Admin: Bulk Link Images (Magic Photo Match)
app.post('/api/admin/bulk-link-images', authenticateAdmin, upload.array('images', 200), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).json({ error: "No images selected" });

    // Ensure uploads directory exists
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    let updatedCount = 0;
    for (const file of files) {
      const fileName = file.originalname;
      const productName = fileName.split('.')[0].trim(); // Matches 'Laksmi' from 'Laksmi.jpg'
      
      const targetPath = `uploads/${fileName}`;
      // Move file from temporary location to static uploads folder
      fs.renameSync(file.path, targetPath);
      
      const imageUrl = `/uploads/${fileName}`;

      const [result] = await db.query(
        "UPDATE products SET image = ? WHERE name LIKE ?", 
        [imageUrl, `%${productName}%`]
      );
      if (result.affectedRows > 0) updatedCount++;
    }

    res.json({ message: `Magic Match Complete! Linked ${updatedCount} products.`, count: updatedCount });
  } catch (err) {
    console.error("Bulk Photo Link Error:", err);
    res.status(500).json({ error: "Internal error during magic link." });
  }
});

// --- SESSION ROUTES ---

// Check if online ordering is currently open
app.get('/api/session/status', async (req, res) => {
  try {
    const now = new Date();
    const [rows] = await db.query(
      `SELECT * FROM order_sessions 
       WHERE isActive = 1 
         AND startDate <= ? 
         AND endDate >= ?
       ORDER BY startDate DESC LIMIT 1`,
      [now, now]
    );
    if (rows.length > 0) {
      res.json({ isOpen: true, session: rows[0] });
    } else {
      // Check if no sessions exist at all → open by default (demo mode)
      const [allSessions] = await db.query('SELECT COUNT(*) as count FROM order_sessions');
      if (allSessions[0].count === 0) {
        res.json({ isOpen: true, session: null });
      } else {
        // Find next upcoming session
        const [next] = await db.query(
          `SELECT * FROM order_sessions WHERE isActive = 1 AND startDate > ? ORDER BY startDate ASC LIMIT 1`,
          [now]
        );
        res.json({ isOpen: false, nextSession: next[0] || null });
      }
    }
  } catch (err) {
    res.json({ isOpen: true, session: null }); // fail-open
  }
});

// Get all sessions (admin)
app.get('/api/admin/sessions', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM order_sessions ORDER BY startDate DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new session (admin)
app.post('/api/admin/sessions', authenticateAdmin, async (req, res) => {
  try {
    const { label, startDate, endDate } = req.body;
    await db.execute(
      'INSERT INTO order_sessions (label, startDate, endDate) VALUES (?, ?, ?)',
      [label, startDate, endDate]
    );
    res.json({ message: 'Session created!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle session active/inactive (admin)
app.patch('/api/admin/sessions/:id', authenticateAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    await db.execute('UPDATE order_sessions SET isActive = ? WHERE id = ?', [isActive, req.params.id]);
    res.json({ message: 'Updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete session (admin)
app.delete('/api/admin/sessions/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM order_sessions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (admin)
app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order (admin)
app.delete('/api/admin/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM order_items WHERE orderId = ?', [req.params.id]);
    await db.execute('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Order deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SETTINGS ROUTES ---

// Get all settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM settings');
    const settingsMap = {};
    rows.forEach(row => {
      settingsMap[row.key] = row.value;
    });
    // Add default fallbacks if database misses some rows
    const fallbacks = {
      promo_title: 'FESTIVE DHAMAKA OFFERS!',
      promo_subtitle: 'UP TO 80% OFF ON SELECTED ITEMS',
      free_shipping_threshold: '999',
      global_discount_percent: '0',
      shipping_cost: '100'
    };
    res.json({ ...fallbacks, ...settingsMap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings (admin)
app.post('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await db.execute(
        'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        [key, String(value), String(value)]
      );
    }
    res.json({ message: 'Settings updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Send a context-aware WhatsApp message to customer based on order status
app.post('/api/admin/orders/:id/send-whatsapp', authenticateAdmin, async (req, res) => {
  try {
    const { messageType } = req.body; // 'payment_request' | 'packing' | 'dispatched' | 'generic'
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!orders.length) return res.status(404).json({ error: 'Order not found' });
    const order = orders[0];
    const [items] = await db.query('SELECT * FROM order_items WHERE orderId = ?', [order.id]);

    const [settingsRows] = await db.query("SELECT * FROM settings WHERE `key` IN ('upi_id', 'upi_name')");
    const settingsMap = {};
    settingsRows.forEach(r => { settingsMap[r.key] = r.value; });
    const upiId = settingsMap.upi_id || '7604849468@gpay';
    const upiName = settingsMap.upi_name || 'Durga Agencies';

    if (!whatsappClientReady) return res.status(503).json({ error: 'WhatsApp not connected. Scan QR at /qr' });
    if (!order.phone) return res.status(400).json({ error: 'No phone number for this customer.' });

    let formattedPhone = order.phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;
    const customerChatId = `${formattedPhone}@c.us`;
    const itemsList = items.map(i => `  - ${i.name} x ${i.qty} = Rs.${i.price * i.qty}`).join('\n');
    const billNumber = order.billNumber || order.id;
    let message = '';

    if (messageType === 'payment_request') {
      message = `🎉 *DURGA AGENCIES — Order Confirmed!*\n\nHi *${order.customerName}*,\n\nThank you for your order! ✅\n\n📦 *Order ID:* #${billNumber}\n💰 *Total Amount:* Rs.${order.totalAmount}\n\n*Your Order:*\n${itemsList}\n\n---\n💳 *PAYMENT INSTRUCTIONS*\n\nPlease pay *Rs.${order.totalAmount}* via any UPI app:\n🔹 UPI ID: *${upiId}*\n🔹 Name: ${upiName}\n\n⚠️ After payment, please send the screenshot as a reply to this message. Your parcel will be dispatched only after payment confirmation.\n\nThank you! 🙏🪔`;
    } else if (messageType === 'packing') {
      message = `📦 *DURGA AGENCIES — Payment Confirmed!*\n\nHi *${order.customerName}*,\n\nYour payment has been confirmed. We are now *PACKING your order!* 🎉\n\n📦 *Order ID:* #${billNumber}\n💰 *Amount Paid:* Rs.${order.totalAmount}\n\nWe will notify you once dispatched.\n${order.deliveryNote ? `\n📋 *Note:* ${order.deliveryNote}` : ''}\n\nThank you for choosing Durga Agencies! 🪔`;
    } else if (messageType === 'dispatched') {
      message = `🚚 *DURGA AGENCIES — Parcel Dispatched!*\n\nHi *${order.customerName}*,\n\nYour order has been *DISPATCHED* and is on its way! 🎉\n\n📦 *Order ID:* #${billNumber}\n📍 *Delivery Address:* ${order.address}\n${order.deliveryNote ? `\n🚚 *Van Info:* ${order.deliveryNote}` : ''}\n\n⚠️ Delivery charges are on a To-Pay basis. Please pay the lorry transport office on collection.\n\nThank you! 🪔`;
    } else {
      message = `📋 *DURGA AGENCIES — Order Update*\n\nHi *${order.customerName}*,\n\n*Order ID:* #${billNumber}\n*Status:* ${order.orderStatus || 'Pending Payment'}\n${order.deliveryNote ? `\n*Note:* ${order.deliveryNote}` : ''}\n\nFor queries, reply to this message.\n\nThank you! 🪔`;
    }

    await whatsappClient.sendMessage(customerChatId, message);
    res.json({ success: true, message: 'WhatsApp message sent!' });
  } catch (err) {
    console.error('WhatsApp Send Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

