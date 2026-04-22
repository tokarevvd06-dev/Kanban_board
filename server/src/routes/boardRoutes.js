const router = require('express').Router();

const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/boardController');

/* =========================
   BOARDS
========================= */

// создать доску
router.post('/', auth, controller.createBoard);

// получить мои доски
router.get('/my', auth, controller.getMyBoards);

// получить одну доску
router.get('/:id', auth, controller.getBoard);

// получить доску с колонками и задачами
router.get('/:id/full', auth, controller.getFullBoard);

module.exports = router;