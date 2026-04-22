const pool = require('../db');

/* =========================
   CREATE BOARD
========================= */
exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const boardResult = await pool.query(
      `INSERT INTO boards (title, owner_id)
       VALUES ($1, $2)
       RETURNING *`,
      [title, userId]
    );

    const board = boardResult.rows[0];

    // добавляем владельца в участники
    await pool.query(
        `INSERT INTO board_members (board_id, user_id, role)
         VALUES ($1, $2, $3)`,
        [board.id, userId, 'owner']
      );

    res.json(board);

  } catch (err) {
    console.error('CREATE BOARD ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};


/* =========================
   GET MY BOARDS
========================= */
exports.getMyBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT b.*
       FROM boards b
       JOIN board_members bm ON bm.board_id = b.id
       WHERE bm.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error('GET MY BOARDS ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};


/* =========================
   GET BOARD BY ID
========================= */
exports.getBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM boards WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error('GET BOARD ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};


/* =========================
   GET FULL BOARD (columns + tasks)
========================= */
exports.getFullBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const boardRes = await pool.query(
      `SELECT * FROM boards WHERE id = $1`,
      [id]
    );

    if (!boardRes.rows.length) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const columnsRes = await pool.query(
      `SELECT * FROM columns
       WHERE board_id = $1
       ORDER BY position ASC`,
      [id]
    );

    const columns = columnsRes.rows;

    const tasksRes = await pool.query(
      `SELECT * FROM tasks
       WHERE column_id IN (
         SELECT id FROM columns WHERE board_id = $1
       )
       ORDER BY position ASC`,
      [id]
    );

    const tasks = tasksRes.rows;

    const result = columns.map(col => ({
      ...col,
      tasks: tasks.filter(t => t.column_id === col.id)
    }));

    res.json({
      board: boardRes.rows[0],
      columns: result
    });

  } catch (err) {
    console.error('GET FULL BOARD ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};