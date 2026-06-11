const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/boardController");
const { checkBoardAccess } = require("../middleware/accessMiddleware");
const { requireFields } = require("../middleware/validate");

// создать доску
router.post("/", auth, requireFields("title"), controller.createBoard);

// получить мои доски
router.get("/my", auth, controller.getMyBoards);

// получить одну доску
router.get("/:boardId", auth, checkBoardAccess, controller.getBoard);

// получить доску с колонками и задачами
router.get("/:boardId/full", auth, controller.getFullBoard);

router.delete(
  "/:boardId",
  auth,
  checkBoardAccess,
  controller.deleteBoard,
);

module.exports = router;
