const pool = require('../db');
const asyncHandler = require('../middleware/asyncHandler');

// ➕ Создать комментарий к задаче
exports.createComment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    `INSERT INTO comments (task_id, author_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [taskId, userId, content]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

// 📥 Получить все комментарии задачи
exports.getTaskComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const result = await pool.query(
    `SELECT c.*, u.email
     FROM comments c
     JOIN users u ON u.id = c.author_id
     WHERE c.task_id = $1
     ORDER BY c.created_at ASC`,
    [taskId]
  );

  res.json({ success: true, data: result.rows });
});

// ❌ Удалить комментарий (только автор)
exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const result = await pool.query(
    `DELETE FROM comments
     WHERE id = $1 AND author_id = $2
     RETURNING *`,
    [commentId, userId]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  res.json({ success: true, data: 'Комментарий удалён' });
});



// ✏️ Обновить комментарий (только автор)
exports.updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    `UPDATE comments
     SET content = $1
     WHERE id = $2 AND author_id = $3
     RETURNING *`,
    [content, commentId, userId]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ error: 'Нет доступа к комментарию' });
  }

  res.json({ success: true, data: result.rows[0] });
});