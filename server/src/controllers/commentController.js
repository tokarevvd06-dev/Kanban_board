const pool = require('../db');

// ➕ Создать комментарий к задаче
exports.createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO comments (task_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [taskId, userId, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Получить все комментарии задачи
exports.getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.email
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.task_id = $1
       ORDER BY c.created_at ASC`,
      [taskId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Удалить комментарий (только автор)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM comments
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [commentId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    res.json({ message: 'Комментарий удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};