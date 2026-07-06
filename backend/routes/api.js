const express = require('express');
const router = express.Router();
const { authenticate, requireAuth, requireAdmin } = require('../../middlewares/auth');

const authController = require('../controllers/authController');
const gameController = require('../controllers/gameController');
const adminController = require('../controllers/adminController');

// Middleware xác thực chạy qua mọi request
router.use(authenticate);

// --- Auth Routes ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- Game & User Routes ---
router.get('/leaderboard', gameController.getLeaderboard);
router.post('/scores', requireAuth, gameController.saveScore);

router.get('/comments', gameController.getComments);
router.post('/comments', gameController.postComment);

router.post('/contact', gameController.postContact);

// --- Admin Routes ---
router.post('/track_view', adminController.trackView);
router.get('/admin/stats', requireAdmin, adminController.getStats);
router.get('/settings', adminController.getSettings);
router.post('/settings', requireAdmin, adminController.updateSettings);
router.delete('/comments/:id', requireAdmin, adminController.deleteComment);

module.exports = router;
