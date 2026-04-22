const pool = require('../db');

exports.createColumn = async (req, res) => {
  const { boardId, title } = req.body;

  try {
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

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getColumnsByBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM columns
       WHERE board_id = $1
       ORDER BY position`,
      [boardId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reorderColumns = async (req, res) => {
  const { columns } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const col of columns) {
      await client.query(
        `UPDATE columns
         SET position = $1
         WHERE id = $2`,
        [col.position, col.id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Columns reordered' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};