const pool = require('../db');

module.exports = async function checkBoardAccess(req, res, next) {
  try {
    const userId = req.user.id;
    const boardId =
      req.params.boardId ||
      req.params.id ||
      req.body.boardId;

    const result = await pool.query(
      `SELECT 1 FROM board_members
       WHERE board_id = $1 AND user_id = $2`,
      [boardId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Нет доступа к доске' });
    }

    next();
  } catch (e) {
    res.status(500).json({ error: 'error1' });
  }
};