const { getPool } = require('../../config/database');
const { tokens } = require('../../middlewares/auth');
const crypto = require('crypto');

const hash = s => crypto.createHash('sha256').update(s).digest('hex');

exports.register = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        if (!name || !username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
        }
        const [r] = await getPool().query(
            "INSERT INTO users(name,username,password_hash) VALUES(?,?,?)",
            [name, username, hash(password)]
        );
        return res.status(201).json({ id: r.insertId });
    } catch (e) {
        return res.status(500).json({ message: e.code === 'ER_DUP_ENTRY' ? 'Tên đăng nhập đã tồn tại' : 'Lỗi server' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [[u]] = await getPool().query(
            'SELECT * FROM users WHERE username=? AND password_hash=?',
            [username, hash(password || '')]
        );
        if (!u) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        
        const token = crypto.randomBytes(24).toString('hex');
        const [[s1]] = await getPool().query('SELECT MAX(score) as m FROM scores WHERE user_id=? AND game_id=1', [u.id]);
        const [[s2]] = await getPool().query('SELECT MAX(score) as m FROM scores WHERE user_id=? AND game_id=2', [u.id]);
        
        const user = { 
            id: u.id, name: u.name, username: u.username, role: u.role,
            best1: s1.m || 0, best2: s2.m || 0
        };
        tokens.set(token, user);
        
        return res.status(200).json({ token, user });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};
