require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/database');
const apiRoutes = require('./backend/routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json()); // Tự động parse JSON body

// API Routes
app.use('/api', apiRoutes);

// Phục vụ các file tĩnh (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'frontend/src')));
app.use('/css', express.static(path.join(__dirname, 'frontend/css')));
app.use('/js', express.static(path.join(__dirname, 'frontend/js')));

// Trang chủ luôn trả về index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/src/index.html'));
});

// Khởi động server
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 Game Website running with Express at http://localhost:${PORT}`));
    })
    .catch(e => {
        console.error('Failed to start server:', e.message);
        process.exit(1);
    });
