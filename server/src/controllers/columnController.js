const pool = require('../db');
const asyncHandler = require('../middleware/asyncHandler');

exports.createColumn = asyncHandler(async (req, res) => {
  const { boardId, title } = req.body;

  const boardCheck = await pool.query(
    `SELECT id FROM boards WHERE id = $1`,
    [boardId]
  );
  
  if (!boardCheck.rows.length) {
    const err = new Error('Board not found');
    err.status = 404;
    throw err;
  }

  const accessCheck = await pool.query(
    `SELECT 1 FROM board_members
     WHERE board_id = $1 AND user_id = $2`,
    [boardId, req.user.id]
  );
  
  if (!accessCheck.rows.length) {
    const err = new Error('Access denied to this board');
    err.status = 403;
    throw err;
  }

  const positionResult = await pool.query(
    `SELECT COALESCE(MAX(position), 0) + 1 AS next_position
     FROM columns WHERE board_id = $1`,
    [boardId]
  );

    const position = positionResult.rows[0].next_position;

    const result = await pool.query(
      `INSERT INTO columns (board_id, title, position)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [boardId, title, position]
    );

    res.json({ success: true, data: result.rows[0] });
  });

exports.getColumnsByBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const result = await pool.query(
    `SELECT * FROM columns
     WHERE board_id = $1
     ORDER BY position`,
    [boardId]
  );

  res.json({ success: true, data: result.rows });
});

exports.reorderColumns = async (req, res) => {
  const { columns } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE columns IN EXCLUSIVE MODE');

    for (const col of columns) {
      await client.query(
        `UPDATE columns
         SET position = $1
         WHERE id = $2`,
        [col.position, col.id]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, data: 'Columns reordered' });
    } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};