const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const comments = require('../controllers/commentController');
const { checkTaskAccess } = require('../middleware/accessMiddleware');

router.post('/task/:taskId', auth, checkTaskAccess, comments.createComment);
router.get('/task/:taskId', auth, checkTaskAccess, comments.getTaskComments);
router.patch('/:commentId', auth, comments.updateComment);
router.delete('/:commentId', auth, comments.deleteComment);

module.exports = router;