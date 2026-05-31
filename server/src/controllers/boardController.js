const pool = require("../db");
const asyncHandler = require("../middleware/asyncHandler");

exports.createBoard = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const boardResult = await pool.query(
    `INSERT INTO boards (title, owner_id)
     VALUES ($1, $2)
     RETURNING *`,
    [title, userId],
  );

  const board = boardResult.rows[0];

  await pool.query(
    `INSERT INTO board_members (board_id, user_id, role)
       VALUES ($1, $2, $3)`,
    [board.id, userId, "owner"],
  );

  res.json({ success: true, data: board });
});

exports.getMyBoards = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.title,
      b.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'title', c.title
          )
          ORDER BY c.position
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS columns
    FROM boards b
    JOIN board_members bm ON bm.board_id = b.id
    LEFT JOIN columns c ON c.board_id = b.id
    WHERE bm.user_id = $1
    GROUP BY b.id
    ORDER BY b.created_at DESC
    `,
    [userId],
  );

  res.json({ success: true, data: result.rows });
});

exports.getBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const result = await pool.query(`SELECT * FROM boards WHERE id = $1`, [
    boardId,
  ]);

  if (!result.rows.length) {
    const err = new Error("Board not found");
    err.status = 404;
    throw err;
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
});

exports.getFullBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const boardRes = await pool.query(`SELECT * FROM boards WHERE id = $1`, [
    boardId,
  ]);

  if (!boardRes.rows.length) {
    const err = new Error("Board not found");
    err.status = 404;
    throw err;
  }

  const accessRes = await pool.query(
    `SELECT 1 FROM board_members
     WHERE board_id = $1 AND user_id = $2`,
    [boardId, req.user.id],
  );

  if (!accessRes.rows.length) {
    const err = new Error("Access denied to this board");
    err.status = 403;
    throw err;
  }

  const columnsRes = await pool.query(
    `SELECT * FROM columns
     WHERE board_id = $1
     ORDER BY position ASC`,
    [boardId],
  );

  const columns = columnsRes.rows;

  const tasksRes = await pool.query(
    `SELECT * FROM tasks
     WHERE column_id IN (
       SELECT id FROM columns WHERE board_id = $1
     )
     ORDER BY position ASC`,
    [boardId],
  );

  const tasks = tasksRes.rows;

  const result = columns.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => t.column_id === col.id),
  }));

  res.json({
    success: true,
    data: {
      board: boardRes.rows[0],
      columns: result,
    },
  });
});
