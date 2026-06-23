CREATE DATABASE IF NOT EXISTS crackers_shop;
USE crackers_shop;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    originalPrice DECIMAL(10, 2) DEFAULT 0,
    offer INT DEFAULT 0,
    image LONGTEXT,
    stock INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    billNumber VARCHAR(100) UNIQUE,
    customerName VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    items JSON,
    totalAmount DECIMAL(10, 2),
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    orderType ENUM('online', 'pos') DEFAULT 'online',
    paymentStatus ENUM('pending', 'paid') DEFAULT 'pending'
);
