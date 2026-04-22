const pool = require('../db');

/* =========================
   CHECK BOARD ACCESS
========================= */
exports.checkBoardAccess = async (req, res, next) => {
  try {
    const boardId =
      req.params.boardId ||
      req.body.boardId ||
      req.params.id;

    const userId = req.user.id;

    if (!boardId) {
      return res.status(400).json({ error: 'boardId not provided' });
    }

    const result = await pool.query(
      `SELECT role FROM board_members
       WHERE board_id = $1 AND user_id = $2`,
      [boardId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this board' });
    }

    req.userRole = result.rows[0].role;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   CHECK COLUMN ACCESS
========================= */
exports.checkColumnAccess = async (req, res, next) => {
  try {
    const columnId = req.params.columnId || req.body.columnId;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT bm.role
       FROM columns c
       JOIN board_members bm ON bm.board_id = c.board_id
       WHERE c.id = $1 AND bm.user_id = $2`,
      [columnId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this column' });
    }

    req.userRole = result.rows[0].role;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   CHECK TASK ACCESS
========================= */
exports.checkTaskAccess = async (req, res, next) => {
  try {
    const taskId = req.params.taskId || req.body.taskId;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT bm.role
       FROM tasks t
       JOIN columns c ON c.id = t.column_id
       JOIN board_members bm ON bm.board_id = c.board_id
       WHERE t.id = $1 AND bm.user_id = $2`,
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this task' });
    }

    req.userRole = result.rows[0].role;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};