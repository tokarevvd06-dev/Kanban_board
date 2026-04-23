const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/taskController');
const { checkColumnAccess, checkTaskAccess } = require('../middleware/accessMiddleware');
const { requireFields } = require('../middleware/validate')

router.post('/', auth, 
    requireFields('columnId', 'title'),
    controller.createTask
  );
router.get('/:columnId', auth, checkColumnAccess, controller.getTasksByColumn);
router.patch('/reorder', auth, checkColumnAccess,
    requireFields('tasks'),
    controller.reorderTasks
);
router.patch('/move', auth, checkTaskAccess,
    requireFields('taskId', 'fromColumnId', 'toColumnId', 'newPosition'),
    controller.moveTask
);
module.exports = router;