const router = require('express').Router();
const auth = require('../middleware/authMiddleware');

const controller = require('../controllers/columnController');
const { checkBoardAccess, checkColumnAccess } = require('../middleware/accessMiddleware');

router.post('/', auth, checkBoardAccess, controller.createColumn);
router.get('/board/:boardId', auth, checkBoardAccess, controller.getColumnsByBoard);
router.patch('/reorder', auth, checkBoardAccess, controller.reorderColumns);
module.exports = router;