const { getPool } = require('../../config/database');

exports.getLeaderboard = async (req, res) => {
    try {
        const gId = req.query.game_id || 1;
        const [rows] = await getPool().query(
            'SELECT u.id, u.name, MAX(s.score) as score FROM users u JOIN scores s ON s.user_id = u.id WHERE s.game_id=? GROUP BY u.id, u.name ORDER BY score DESC LIMIT 50',
            [gId]
        );
        return res.status(200).json(rows);
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.saveScore = async (req, res) => {
    try {
        const { score: reqScore, game_id } = req.body;
        const score = Math.max(0, Math.floor(+reqScore || 0));
        const gId = game_id || 1;
        
        await getPool().query('INSERT INTO scores(user_id,game_id,score) VALUES(?,?,?)', [req.user.id, gId, score]);
        
        const [[{ rank }]] = await getPool().query(
            'SELECT COUNT(DISTINCT user_id) + 1 as rank FROM (SELECT user_id, MAX(score) as max_s FROM scores WHERE game_id=? GROUP BY user_id) t WHERE max_s > ?',
            [gId, score]
        );
        return res.status(201).json({ score, rank });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const gId = req.query.game_id || 1;
        const [r] = await getPool().query(
            'SELECT id,sender_name senderName,sender_email senderEmail,rating_score ratingScore,content,created_at createdAt FROM comments WHERE game_id=? ORDER BY id DESC LIMIT 100',
            [gId]
        );
        return res.status(200).json(r);
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.postComment = async (req, res) => {
    try {
        const { name, email, content, rating, game_id } = req.body;
        if (!name || !email || !content) {
            return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
        }
        
        await getPool().query(
            'INSERT INTO comments(user_id,game_id,sender_name,sender_email,rating_score,content) VALUES(?,?,?,?,?,?)',
            [req.user?.id || null, game_id || 1, name, email, Math.min(5, Math.max(1, +rating || 5)), content]
        );
        return res.status(201).json({ message: 'Đã gửi bình luận' });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.postContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await getPool().query(
            'INSERT INTO contacts(name,email,message) VALUES(?,?,?)',
            [name, email, message]
        );
        return res.status(201).json({ message: 'Cảm ơn bạn đã liên hệ' });
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};
