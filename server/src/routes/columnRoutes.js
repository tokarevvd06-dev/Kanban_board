const router = require('express').Router();
const controller = require('../controllers/columnController');

router.post('/', controller.createColumn);
router.get('/board/:boardId', controller.getColumnsByBoard);
router.patch('/reorder', controller.reorderColumns);

module.exports = router;