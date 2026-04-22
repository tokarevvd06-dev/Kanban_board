const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/taskController');
console.log(controller);
/* CREATE TASK */
router.post('/', auth, controller.createTask);

/* GET TASKS */
router.get('/:columnId', auth, controller.getTasksByColumn);
/* REORDER TASKS */
router.patch('/reorder', auth, controller.reorderTasks);

/* MOVE TASK BETWEEN COLUMNS */
router.patch('/move', auth, controller.moveTask);

module.exports = router;