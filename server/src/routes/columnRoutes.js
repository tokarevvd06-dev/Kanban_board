const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validate')

const controller = require('../controllers/columnController');
const { checkBoardAccess, checkColumnAccess } = require('../middleware/accessMiddleware');

router.post('/', auth,
    requireFields('boardId', 'title'),
    controller.createColumn
);

router.get('/board/:boardId', auth, checkBoardAccess, controller.getColumnsByBoard);
router.patch('/reorder', auth, checkBoardAccess,
    requireFields('columns'),
    controller.reorderColumns
);
module.exports = router;