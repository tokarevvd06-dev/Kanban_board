const pool = require('../db');

// ➕ Добавить участника на доску (только owner)
exports.addMember = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { email } = req.body;

    if (req.userRole !== 'owner') {
      return res.status(403).json({ error: 'Только владелец может добавлять участников' });
    }

    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const userId = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO board_members (board_id, user_id, role)
       VALUES ($1, $2, 'member')
       ON CONFLICT DO NOTHING`,
      [boardId, userId]
    );

    res.json({ message: 'Участник добавлен' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Получить всех участников доски
exports.getMembers = async (req, res) => {
  try {
    const { boardId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.email, bm.role
       FROM board_members bm
       JOIN users u ON u.id = bm.user_id
       WHERE bm.board_id = $1`,
      [boardId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Удалить участника (нельзя удалить owner)
exports.removeMember = async (req, res) => {
  try {
    const { boardId, userId } = req.params;

    if (req.userRole !== 'owner') {
      return res.status(403).json({ error: 'Только владелец может удалять участников' });
    }

    const roleResult = await pool.query(
      `SELECT role FROM board_members
       WHERE board_id = $1 AND user_id = $2`,
      [boardId, userId]
    );

    if (roleResult.rows[0]?.role === 'owner') {
      return res.status(400).json({ error: 'Нельзя удалить владельца доски' });
    }

    await pool.query(
      `DELETE FROM board_members
       WHERE board_id = $1 AND user_id = $2`,
      [boardId, userId]
    );

    res.json({ message: 'Участник удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};