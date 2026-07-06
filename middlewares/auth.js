const tokens = new Map();

function authenticate(req, res, next) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    req.user = tokens.get(token) || null;
    next();
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Hãy đăng nhập' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Chỉ quản trị viên' });
    }
    next();
}

module.exports = { authenticate, requireAuth, requireAdmin, tokens };
