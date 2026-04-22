const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const comments = require('../controllers/commentController');

router.post('/task/:taskId', auth, comments.createComment);
router.get('/task/:taskId', auth, comments.getTaskComments);
router.delete('/:commentId', auth, comments.deleteComment);

module.exports = router;