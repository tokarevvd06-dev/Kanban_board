const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/taskController');
const { checkColumnAccess, checkTaskAccess } = require('../middleware/accessMiddleware');

router.post('/', auth, checkColumnAccess, controller.createTask);
router.get('/:columnId', auth, checkColumnAccess, controller.getTasksByColumn);
router.patch('/reorder', auth, checkColumnAccess, controller.reorderTasks);
router.patch('/move', auth, checkTaskAccess, controller.moveTask);

module.exports = router;