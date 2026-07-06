const { getPool } = require('../../config/database');

exports.trackView = async (req, res) => {
    try {
        await getPool().query('UPDATE site_stats SET views = views + 1 WHERE id=1');
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const [[stat]] = await getPool().query('SELECT views FROM site_stats WHERE id=1');
        const [[users]] = await getPool().query('SELECT COUNT(*) c FROM users');
        const [[cmts]] = await getPool().query('SELECT COUNT(*) c FROM comments');
        return res.status(200).json({ views: stat.views, users: users.c, comments: cmts.c });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getSettings = async (req, res) => {
    try {
        const [rows] = await getPool().query('SELECT * FROM settings');
        const obj = {};
        rows.forEach(r => obj[r.key_name] = r.val);
        return res.status(200).json(obj);
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { val, key } = req.body;
        await getPool().query('UPDATE settings SET val=? WHERE key_name=?', [val, key]);
        return res.status(200).json({ message: 'Đã cập nhật' });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await getPool().query('DELETE FROM comments WHERE id=?', [req.params.id]);
        return res.status(200).json({ message: 'Đã xóa' });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};
