const mysql = require('mysql2/promise');
const crypto = require('crypto');

let pool;
const hash = s => crypto.createHash('sha256').update(s).digest('hex');

async function connectDB() {
    const base = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: +(process.env.DB_PORT || 3307),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });
    await base.query('CREATE DATABASE IF NOT EXISTS flappy_tabs CHARACTER SET utf8mb4');
    await base.end();

    pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: +(process.env.DB_PORT || 3307),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'flappy_tabs',
        multipleStatements: true
    });

    const fs = require('fs');
    const path = require('path');
    const sql = fs.readFileSync(path.join(__dirname, '../database.sql')).toString();
    await pool.query(sql);

    // Create default admin
    await pool.query(
        "INSERT IGNORE INTO users(name,username,password_hash,role) VALUES('Administrator','admin',?,'admin')",
        [hash('admin123')]
    );

    return pool;
}

function getPool() {
    return pool;
}

module.exports = { connectDB, getPool };
