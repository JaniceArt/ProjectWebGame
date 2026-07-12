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
INSERT IGNORE INTO users(id, name, username, password_hash, role) VALUES(1, 'Quản trị viên', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin');

-- Dữ liệu mẫu (Sample Data) cho Giảng viên chấm điểm
INSERT IGNORE INTO users(id, name, username, password_hash, role) VALUES
    (2, 'Nguyễn Văn A', 'nva', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'user'),
    (3, 'Trần Thị B', 'ttb', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'user'),
    (4, 'Lê Hoàng C', 'lhc', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'user');

INSERT IGNORE INTO scores(id, user_id, game_id, score) VALUES
    (1, 2, 1, 45), (2, 3, 1, 32), (3, 4, 1, 89), (4, 2, 1, 12),
    (5, 2, 2, 120), (6, 3, 2, 95), (7, 4, 2, 150);

INSERT IGNORE INTO comments(id, user_id, game_id, sender_name, sender_email, rating_score, content) VALUES
    (1, 2, 1, 'Nguyễn Văn A', 'nva@gmail.com', 5, 'Game rất cuốn! Chơi hoài không chán.'),
    (2, 3, 1, 'Trần Thị B', 'ttb@gmail.com', 4, 'Hơi khó xíu nhưng đồ họa xịn quá.'),
    (3, 4, 2, 'Lê Hoàng C', 'lhc@gmail.com', 5, 'Aim Trainer giúp luyện phản xạ cực kỳ tốt, vote 5 sao!');
