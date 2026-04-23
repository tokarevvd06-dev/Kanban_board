const pool = require('../db');
const asyncHandler = require('../middleware/asyncHandler');

exports.createTask = asyncHandler(async (req, res) => {
  const { columnId, title, description } = req.body;

  const columnCheck = await pool.query(
    `SELECT id FROM columns WHERE id = $1`,
    [columnId]
  );
  
  if (!columnCheck.rows.length) {
    const err = new Error('Column not found');
    err.status = 404;
    throw err;
  }

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

  res.json({ success: true, data: result.rows[0] });
});

exports.moveTask = async (req, res) => {
    const client = await pool.connect();
  
    try {
      const { taskId, fromColumnId, toColumnId, newPosition } = req.body;
  
      await client.query('BEGIN');
      await client.query('LOCK TABLE tasks IN EXCLUSIVE MODE');
      // 1. получаем старую позицию задачи
      const taskRes = await client.query(
        `SELECT position FROM tasks WHERE id = $1`,
        [taskId]
      );
  
      const oldPosition = taskRes.rows[0].position;
  
      if (fromColumnId === toColumnId) {
        if (newPosition === oldPosition) {
          return res.json({ success: true, data: 'No changes' });
        }
      
        // сдвиг внутри одной колонки
        await client.query(
          `UPDATE tasks
           SET position = position + CASE
             WHEN $1 < $2 THEN -1
             ELSE 1
           END
           WHERE column_id = $3
             AND position BETWEEN LEAST($1, $2) AND GREATEST($1, $2)
             AND id != $4`,
          [oldPosition, newPosition, fromColumnId, taskId]
        );
      
        await client.query(
          `UPDATE tasks SET position = $1 WHERE id = $2`,
          [newPosition, taskId]
        );
      
        await client.query('COMMIT');
        return res.json({ success: true, data: 'Task moved inside column' });
      }
      
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
  
      res.json({ success: true, data: 'Task moved' });
  
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: err.message });
  
    } finally {
      client.release();
    }
  };

exports.getTasksByColumn = asyncHandler(async (req, res) => {
  const { columnId } = req.params;

  const result = await pool.query(
    `SELECT * FROM tasks
     WHERE column_id = $1
     ORDER BY position`,
    [columnId]
  );

  res.json({ success: true, data: result.rows });
});

exports.reorderTasks = async (req, res) => {
  const { tasks } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE tasks IN EXCLUSIVE MODE');

    for (const task of tasks) {
      await client.query(
        `UPDATE tasks
         SET position = $1
         WHERE id = $2`,
        [task.position, task.id]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, data: 'Tasks reordered' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};