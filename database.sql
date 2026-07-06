CREATE DATABASE IF NOT EXISTS flappy_tabs CHARACTER SET utf8mb4;
USE flappy_tabs;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80),
    username VARCHAR(50) UNIQUE,
    password_hash CHAR(64),
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    game_id INT DEFAULT 1,
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    game_id INT DEFAULT 1,
    sender_name VARCHAR(80),
    sender_email VARCHAR(120),
    rating_score TINYINT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80),
    email VARCHAR(120),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_stats (
    id INT PRIMARY KEY,
    views INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
    key_name VARCHAR(50) PRIMARY KEY,
    val TEXT
);

-- Seed Data
INSERT IGNORE INTO site_stats(id, views) VALUES(1, 0);
INSERT IGNORE INTO games(id, name, description) VALUES
    (1, 'Flappy Bird', 'Điều khiển chú chim bay qua các ống nước.'),
    (2, 'Aim Trainer', 'Luyện phản xạ: Bấm vào mục tiêu (hình tròn màu đỏ) xuất hiện ngẫu nhiên để ghi điểm.');
INSERT IGNORE INTO settings(key_name, val) VALUES('home_desc', 'Chào mừng đến với hệ thống Game Portal.');
