const pool = require('../db');

exports.createTask = async (req, res) => {
  const { columnId, title, description } = req.body;

  try {
    const positionResult = await pool.query(
      `SELECT COALESCE(MAX(position), 0) + 1 AS next_position
       FROM tasks WHERE column_id = $1`,
      [columnId]
    );

    const position = positionResult.rows[0].next_position;

    const result = await pool.query(
      `INSERT INTO tasks (column_id, title, description, position)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [columnId, title, description, position]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.moveTask = async (req, res) => {
    const client = await pool.connect();
  
    try {
      const { taskId, fromColumnId, toColumnId, newPosition } = req.body;
  
      await client.query('BEGIN');
  
      // 1. получаем старую позицию задачи
      const taskRes = await client.query(
        `SELECT position FROM tasks WHERE id = $1`,
        [taskId]
      );
  
      const oldPosition = taskRes.rows[0].position;
  
      /* =========================
         STEP 1: FIX OLD COLUMN
      ========================= */
  
      await client.query(
        `UPDATE tasks
         SET position = position - 1
         WHERE column_id = $1 AND position > $2`,
        [fromColumnId, oldPosition]
      );
  
      /* =========================
         STEP 2: SHIFT NEW COLUMN
      ========================= */
  
      await client.query(
        `UPDATE tasks
         SET position = position + 1
         WHERE column_id = $1 AND position >= $2`,
        [toColumnId, newPosition]
      );
  
      /* =========================
         STEP 3: MOVE TASK
      ========================= */
  
      await client.query(
        `UPDATE tasks
         SET column_id = $1,
             position = $2
         WHERE id = $3`,
        [toColumnId, newPosition, taskId]
      );
  
      await client.query('COMMIT');
  
      res.json({ ok: true });
  
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: err.message });
  
    } finally {
      client.release();
    }
  };

exports.getTasksByColumn = async (req, res) => {
  const { columnId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE column_id = $1
       ORDER BY position`,
      [columnId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reorderTasks = async (req, res) => {
  const { tasks } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const task of tasks) {
      await client.query(
        `UPDATE tasks
         SET position = $1
         WHERE id = $2`,
        [task.position, task.id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Tasks reordered' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};